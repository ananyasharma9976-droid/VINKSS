import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  Edit3,
  Lock,
  LogIn,
  LogOut,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useFirebaseAuth } from '../contexts/FirebaseContext';
import { INVITATION_DATA } from '../data/invitationData';
import {
  createRsvpRecord,
  deleteRsvpRecord,
  exportRsvpsToCsv,
  FirestoreRsvpRecord,
  RSVP_EVENT_OPTIONS,
  subscribeToHostRsvps,
  updateRsvpRecord,
} from '../services/rsvpService';
import { Interactive3DCard } from './Interactive3DCard';
import { ResilientImage } from './ResilientImage';
import { ScrollReveal3D } from './ScrollReveal3D';

interface LocalRsvpReceipt {
  id: string;
  guestName: string;
  phone: string;
  guestsCount: number;
  events: string[];
  blessing: string;
  submittedAtIso: string;
}

const LOCAL_RECEIPTS_KEY = 'vinayak_ruchi_local_rsvps_v1';

function readLocalReceipts(): LocalRsvpReceipt[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_RECEIPTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LocalRsvpReceipt[]) : [];
  } catch {
    return [];
  }
}

export function FamilyRsvpView() {
  const { user, authReady, isHost, authBusy, authError, signInWithGoogle, signOutUser, clearAuthError } =
    useFirebaseAuth();

  const [guestName, setGuestName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestsCount, setGuestsCount] = useState(2);
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    'Wedding Muhurat (24 Nov)',
    'Dinner & Reception (24 Nov)',
  ]);
  const [blessing, setBlessing] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [localReceipts, setLocalReceipts] = useState<LocalRsvpReceipt[]>(() => readLocalReceipts());
  const [records, setRecords] = useState<FirestoreRsvpRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [copiedReply, setCopiedReply] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Host Guest List filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [ceremonyFilter, setCeremonyFilter] = useState<string>('all');

  // Persist lightweight confirmation receipts locally so guests see what they submitted without logging in
  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_RECEIPTS_KEY, JSON.stringify(localReceipts));
    } catch {
      // Ignore storage quota errors
    }
  }, [localReceipts]);

  // Attach real-time Firestore listener strictly when verified wedding host is signed in
  useEffect(() => {
    if (!authReady || !user || !user.emailVerified || !isHost) {
      setRecords([]);
      setLoadingRecords(false);
      return;
    }

    setLoadingRecords(true);
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = subscribeToHostRsvps(
        (items) => {
          setRecords(items);
          setLoadingRecords(false);
          setFormError(null);
        },
        (msg) => {
          setFormError(msg);
          setLoadingRecords(false);
        }
      );
    } catch (err) {
      setLoadingRecords(false);
      setFormError(err instanceof Error ? err.message : 'Unable to load RSVP responses.');
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [authReady, user, isHost]);

  const toggleEvent = (label: string) => {
    setSelectedEvents((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const resetForm = () => {
    setEditingId(null);
    setGuestName('');
    setPhone('');
    setGuestsCount(2);
    setSelectedEvents(['Wedding Muhurat (24 Nov)', 'Dinner & Reception (24 Nov)']);
    setBlessing('');
  };

  const startHostEdit = (item: FirestoreRsvpRecord) => {
    setEditingId(item.id);
    setGuestName(item.guestName);
    setPhone(item.phone);
    setGuestsCount(item.guestsCount);
    setSelectedEvents(item.events.length > 0 ? item.events : ['Wedding Muhurat (24 Nov)']);
    setBlessing(item.blessing);
    setFormError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = guestName.trim();
    if (!trimmedName) {
      setFormError('Please enter your name or family name.');
      return;
    }

    setSubmitting(true);
    setFormError(null);
    setSubmittedNotice(null);

    const eventsToSave =
      selectedEvents.length > 0 ? selectedEvents : ['Wedding Muhurat (24 Nov)'];

    try {
      if (editingId && isHost) {
        await updateRsvpRecord(editingId, {
          guestName: trimmedName,
          phone,
          guestsCount,
          events: eventsToSave,
          blessing,
        });
        setSubmittedNotice('RSVP entry updated in Firestore.');
      } else {
        const docId = await createRsvpRecord({
          guestName: trimmedName,
          phone,
          guestsCount,
          events: eventsToSave,
          blessing,
        });
        const newReceipt: LocalRsvpReceipt = {
          id: docId,
          guestName: trimmedName,
          phone: phone.trim(),
          guestsCount: Math.trunc(Math.max(1, Math.min(20, Number(guestsCount) || 1))),
          events: eventsToSave,
          blessing: blessing.trim(),
          submittedAtIso: new Date().toISOString(),
        };
        setLocalReceipts((prev) => [newReceipt, ...prev].slice(0, 10));
        setSubmittedNotice('Thank you! Your RSVP & blessings have been saved for the Walekar family.');
      }
      resetForm();
      window.setTimeout(() => setSubmittedNotice(null), 5000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Quota exceeded')) {
        setFormError(
          'Daily database quota reached. Please try again tomorrow or use "Copy RSVP Message" to send via WhatsApp.'
        );
      } else {
        setFormError(
          'Could not save your RSVP right now. Please check your connection and try again.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setFormError(null);
    try {
      await deleteRsvpRecord(id);
      if (editingId === id) resetForm();
      setPendingDeleteId(null);
    } catch {
      setFormError('Unable to remove that RSVP entry right now.');
    }
  };

  const latestOrDraftMessage = () => {
    const activeReceipt = localReceipts[0];
    const name = guestName.trim() || activeReceipt?.guestName || 'Guest';
    const count = guestName.trim() ? guestsCount : activeReceipt?.guestsCount || guestsCount;
    const evList =
      (guestName.trim() ? selectedEvents : activeReceipt?.events) || ['Wedding Muhurat (24 Nov)'];
    const note =
      blessing.trim() || activeReceipt?.blessing || 'Warmest congratulations to Vinayak & Ruchi!';
    return `Namaskar Prashant ji, ${name} here. Confirming attendance for ${count} guest(s) for Vinayak & Ruchi's wedding (${evList.join(', ')}). Blessings: ${note}`;
  };

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(latestOrDraftMessage());
      setCopiedReply(true);
      window.setTimeout(() => setCopiedReply(false), 2200);
    } catch {
      setCopiedReply(false);
    }
  };

  // Host summary statistics & filtered guest list
  const hostStats = useMemo(() => {
    const totalGuests = records.reduce((sum, item) => sum + (item.guestsCount || 0), 0);
    const byCeremony = RSVP_EVENT_OPTIONS.map((ev) => {
      const attendees = records
        .filter((r) => r.events.includes(ev))
        .reduce((sum, r) => sum + (r.guestsCount || 0), 0);
      return { event: ev, attendees };
    });
    return {
      totalFamilies: records.length,
      totalGuests,
      byCeremony,
    };
  }, [records]);

  const filteredHostRecords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return records.filter((item) => {
      const matchesEvent =
        ceremonyFilter === 'all' ||
        item.events.includes(ceremonyFilter as (typeof RSVP_EVENT_OPTIONS)[number]);
      const matchesQuery =
        !q ||
        item.guestName.toLowerCase().includes(q) ||
        item.phone.toLowerCase().includes(q) ||
        item.blessing.toLowerCase().includes(q);
      return matchesEvent && matchesQuery;
    });
  }, [records, searchQuery, ceremonyFilter]);

  return (
    <div className="space-y-8">
      <section>
        <ScrollReveal3D direction="up">
          <div className="pb-5 border-b border-[#dfc89e]">
            <p className="font-royal text-xs tracking-[0.14em] text-[#b45309] font-semibold">
              Family &amp; Blessings
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1f1b18] mt-1">
              With Best Wishes From
            </h2>
          </div>
        </ScrollReveal3D>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <ScrollReveal3D direction="left">
            <Interactive3DCard maxTilt={4}>
              <div className="h-full p-5 sm:p-6 bg-gradient-to-br from-[#fffaf0] to-[#faeed3] border border-[#dfc38c]">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-[#2e2822]">
                  {INVITATION_DATA.bestWishesFrom.map((person) => (
                    <li key={person} className="py-1.5 border-b border-[#e8d5af]">
                      {person}
                    </li>
                  ))}
                </ul>
                <p className="font-display italic text-lg text-[#8b261d] mt-4">
                  {INVITATION_DATA.familyCollective}
                </p>
              </div>
            </Interactive3DCard>
          </ScrollReveal3D>

          <ScrollReveal3D direction="right" delay={0.08}>
            <Interactive3DCard maxTilt={4}>
              <div className="relative h-full p-6 bg-gradient-to-br from-[#7c1d17] to-[#5a120e] border-2 border-[#d4a64a] text-[#fff8ea] flex flex-col justify-between overflow-hidden shadow-md">
                <div>
                  <ResilientImage
                    src="/assets/images/floral_toran_arch.png"
                    alt="Marigold and jasmine floral garland accent"
                    fallbackLabel="Floral Accent"
                    className="pointer-events-none select-none w-56 mx-auto -mt-3 mb-2 h-auto object-contain opacity-95"
                  />
                </div>
                <div className="relative z-10 text-center">
                  <p className="font-royal text-xs tracking-[0.14em] text-[#f5d892] font-medium">
                    A Warm Invitation From
                  </p>
                  <p className="text-sm text-[#f7e7c4]/85 mt-1">
                    The groom&apos;s uncles&apos; children
                  </p>
                  <p className="font-display text-2xl sm:text-[26px] text-[#fffaf0] mt-3 leading-snug">
                    {INVITATION_DATA.unclesChildren.slice(0, -1).join(', ')} and{' '}
                    {INVITATION_DATA.unclesChildren.slice(-1)[0]}
                  </p>
                </div>
                <p className="relative z-10 text-center font-display italic text-lg text-[#f7de9c] mt-5 pt-4 border-t border-[#d4a64a]/45">
                  “{INVITATION_DATA.closingNote}”
                </p>
              </div>
            </Interactive3DCard>
          </ScrollReveal3D>
        </div>
      </section>

      <ScrollReveal3D direction="up" delay={0.08}>
        <section className="pt-8 border-t border-[#dfc89e]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <p className="font-royal text-xs tracking-[0.14em] text-[#b45309] font-semibold">
                Guest Response · No Sign-In Needed
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#1f1b18] mt-0.5">
                Confirm Attendance &amp; Leave a Blessing
              </h3>
            </div>

            <button
              type="button"
              onClick={handleCopyMessage}
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 border border-[#c8b288] bg-[#fff8e8] text-[#1f1b18] text-xs font-medium hover:border-[#8b261d] hover:text-[#8b261d] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]"
            >
              {copiedReply ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#8b261d]" aria-hidden="true" />
                  Copied Message for Prashant
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                  Copy RSVP Message
                </>
              )}
            </button>
          </div>

          {/* Auth Error / Form Error Alerts */}
          {(authError || formError) && (
            <div
              role="alert"
              className="mb-4 px-4 py-3 bg-[#fdeceb] border border-[#b91c1c]/40 text-xs sm:text-sm text-[#7f1d1d] flex items-center justify-between gap-3"
            >
              <span>{authError || formError}</span>
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setFormError(null);
                }}
                className="text-xs underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Direct Public RSVP Form (Zero Login Required) */}
          <form
            onSubmit={(e) => void handleSubmit(e)}
            className="p-5 sm:p-6 bg-[#f7ecd5] border border-[#dfc38c] space-y-5"
          >
            {editingId && isHost && (
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#e5cfa4]">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b261d]">
                  <ShieldCheck className="w-4 h-4" aria-hidden="true" />
                  Editing Guest RSVP Entry
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px_110px] gap-4">
              <div>
                <label htmlFor="rsvp-name" className="block text-xs font-medium text-[#3b332b] mb-1.5">
                  Your Name / Family Name
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  required
                  maxLength={120}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g., Shri Rajesh & Smt. Meera Kulkarni"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#fffaf0] border border-[#c8b288] text-sm text-[#1f1b18] placeholder:text-[#8c8070] focus:outline-none focus:border-[#8b261d]"
                />
              </div>

              <div>
                <label htmlFor="rsvp-phone" className="block text-xs font-medium text-[#3b332b] mb-1.5">
                  Phone Number (Optional)
                </label>
                <input
                  id="rsvp-phone"
                  type="tel"
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., 9821xxxxxx"
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#fffaf0] border border-[#c8b288] text-sm text-[#1f1b18] placeholder:text-[#8c8070] tabular-nums focus:outline-none focus:border-[#8b261d]"
                />
              </div>

              <div>
                <label htmlFor="rsvp-count" className="block text-xs font-medium text-[#3b332b] mb-1.5">
                  Guests
                </label>
                <input
                  id="rsvp-count"
                  type="number"
                  min={1}
                  max={20}
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value) || 1)}
                  className="w-full min-h-[42px] px-3.5 py-2 bg-[#fffaf0] border border-[#c8b288] text-sm text-[#1f1b18] tabular-nums focus:outline-none focus:border-[#8b261d]"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#3b332b] mb-2">
                Ceremonies Attending
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {RSVP_EVENT_OPTIONS.map((option) => {
                  const checked = selectedEvents.includes(option);
                  return (
                    <label
                      key={option}
                      className={`flex items-center gap-2.5 px-3 py-2 border text-xs sm:text-sm cursor-pointer transition-colors ${
                        checked
                          ? 'bg-[#fffaf0] border-[#8b261d] text-[#1f1b18]'
                          : 'bg-[#fffaf0]/60 border-[#dfc89e] text-[#5c5346]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEvent(option)}
                        className="accent-[#8b261d] w-4 h-4 shrink-0"
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label htmlFor="rsvp-blessing" className="block text-xs font-medium text-[#3b332b] mb-1.5">
                Blessings &amp; Wishes for Vinayak &amp; Ruchi
              </label>
              <textarea
                id="rsvp-blessing"
                rows={2}
                maxLength={500}
                value={blessing}
                onChange={(e) => setBlessing(e.target.value)}
                placeholder="Write a warm blessing or arrival note..."
                className="w-full px-3.5 py-2.5 bg-[#fffaf0] border border-[#c8b288] text-sm text-[#1f1b18] placeholder:text-[#8c8070] focus:outline-none focus:border-[#8b261d]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 min-h-[42px] px-5 py-2 bg-[#8b261d] text-[#faf7f0] text-sm font-medium hover:bg-[#731e17] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]"
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  {submitting
                    ? 'Saving...'
                    : editingId && isHost
                      ? 'Update Guest RSVP'
                      : 'Submit RSVP & Blessing'}
                </button>

                {editingId && isHost && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="min-h-[42px] px-4 py-2 border border-[#c8b288] bg-[#fffaf0] text-xs font-medium text-[#5c5346] hover:text-[#1f1b18] cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {submittedNotice && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8b261d]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {submittedNotice}
                </span>
              )}
            </div>
          </form>

          {/* Local Confirmation Card(s) for Public Guests on This Device */}
          {localReceipts.length > 0 && !isHost && (
            <div className="mt-6">
              <p className="font-royal text-xs tracking-[0.12em] text-[#7a684a] font-semibold mb-3">
                Sent From This Device ({localReceipts.length})
              </p>
              <div className="divide-y divide-[#e5dac5] border-t border-b border-[#e5dac5]">
                {localReceipts.map((item) => (
                  <div
                    key={item.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-start justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#1f1b18]">
                        {item.guestName}
                        <span className="mx-2 text-[#967332]" aria-hidden="true">
                          ·
                        </span>
                        <span className="text-xs font-normal text-[#5c5346] tabular-nums">
                          {item.guestsCount} {item.guestsCount === 1 ? 'guest' : 'guests'}
                        </span>
                        {item.phone && (
                          <span className="text-xs font-normal text-[#5c5346] ml-2">
                            ({item.phone})
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-[#5c5346] mt-0.5">{item.events.join(' · ')}</p>
                      {item.blessing && (
                        <p className="font-display italic text-base text-[#3b332b] mt-1">
                          “{item.blessing}”
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8b261d] shrink-0">
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Discreet Wedding Host Access Bar OR Full Host Guest List Dashboard */}
          {!authReady ? null : !user ? (
            <div className="mt-8 p-4 bg-[#fffaf0] border border-[#dfc89e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-[#8b261d] mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#1f1b18]">
                    Wedding Host Access · View &amp; Export Guest List
                  </p>
                  <p className="text-[11px] text-[#6d5d45]">
                    Only for the Walekar wedding host to inspect all responses. Guests do not need to log in.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void signInWithGoogle()}
                disabled={authBusy}
                className="inline-flex items-center justify-center gap-1.5 min-h-[38px] px-4 py-2 border border-[#8b261d] bg-[#fff8e8] text-[#8b261d] text-xs font-semibold hover:bg-[#8b261d] hover:text-[#fff8e8] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
              >
                <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
                {authBusy ? 'Signing in...' : 'Host Sign-In'}
              </button>
            </div>
          ) : !isHost ? (
            <div className="mt-8 p-4 bg-[#fffaf0] border border-[#dfc89e] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-[#5c5346]">
                Signed in as <strong className="text-[#1f1b18]">{user.email}</strong>. This account
                does not have host dashboard permissions; guests can submit RSVPs above without signing in.
              </div>
              <button
                type="button"
                onClick={() => void signOutUser()}
                disabled={authBusy}
                className="inline-flex items-center gap-1.5 min-h-[36px] px-3.5 py-1.5 border border-[#c8b288] bg-[#fffaf0] text-xs font-medium text-[#5c5346] hover:border-[#8b261d] hover:text-[#8b261d] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                Sign out
              </button>
            </div>
          ) : (
            <div className="mt-8 p-5 sm:p-6 bg-gradient-to-b from-[#fffaf0] to-[#faeed5] border-2 border-[#d4a64a] shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#dfc89e]">
                <div>
                  <p className="font-royal text-xs tracking-[0.14em] text-[#8b261d] font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" aria-hidden="true" />
                    Host Guest List · Live Firestore Responses ({user.email})
                  </p>
                  <h4 className="font-display text-2xl font-semibold text-[#1f1b18] mt-0.5">
                    All Confirmed Guests &amp; Blessings
                  </h4>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => exportRsvpsToCsv(records)}
                    disabled={records.length === 0}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 bg-[#8b261d] text-[#fff8e8] text-xs font-semibold hover:bg-[#731e17] transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-3.5 h-3.5" aria-hidden="true" />
                    Export Guest List (CSV)
                  </button>

                  <button
                    type="button"
                    onClick={() => void signOutUser()}
                    disabled={authBusy}
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 border border-[#c8b288] bg-[#fffaf0] text-[#5c5346] text-xs font-medium hover:border-[#8b261d] hover:text-[#8b261d] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              </div>

              {/* Headcount KPI Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                <div className="p-3 bg-[#fffaf0] border border-[#dfc38c] text-center">
                  <p className="font-display text-2xl font-bold text-[#8b261d] tabular-nums">
                    {hostStats.totalFamilies}
                  </p>
                  <p className="text-[11px] font-medium text-[#5c5346] mt-0.5">Total RSVPs</p>
                </div>
                <div className="p-3 bg-[#fffaf0] border border-[#dfc38c] text-center">
                  <p className="font-display text-2xl font-bold text-[#8b261d] tabular-nums">
                    {hostStats.totalGuests}
                  </p>
                  <p className="text-[11px] font-medium text-[#5c5346] mt-0.5">Total Guests</p>
                </div>
                {hostStats.byCeremony.map((stat) => (
                  <div
                    key={stat.event}
                    className="p-3 bg-[#fffaf0] border border-[#e5d2ab] text-center"
                  >
                    <p className="font-display text-xl font-bold text-[#1f1b18] tabular-nums">
                      {stat.attendees}
                    </p>
                    <p className="text-[10px] text-[#5c5346] mt-0.5 leading-tight truncate">
                      {stat.event.replace(/\s*\(.*\)/, '')}
                    </p>
                  </div>
                ))}
              </div>

              {/* Search & Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-3">
                <div className="relative">
                  <Search
                    className="w-4 h-4 text-[#8c8070] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guest name, phone, or blessing..."
                    aria-label="Search guest list"
                    className="w-full min-h-[40px] pl-9 pr-3 py-2 bg-[#fffaf0] border border-[#c8b288] text-xs sm:text-sm text-[#1f1b18] placeholder:text-[#8c8070] focus:outline-none focus:border-[#8b261d]"
                  />
                </div>

                <select
                  value={ceremonyFilter}
                  onChange={(e) => setCeremonyFilter(e.target.value)}
                  aria-label="Filter guest list by ceremony"
                  className="w-full min-h-[40px] px-3 py-2 bg-[#fffaf0] border border-[#c8b288] text-xs sm:text-sm text-[#1f1b18] focus:outline-none focus:border-[#8b261d]"
                >
                  <option value="all">All Ceremonies ({records.length})</option>
                  {RSVP_EVENT_OPTIONS.map((ev) => (
                    <option key={ev} value={ev}>
                      {ev}
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Guest Records List */}
              {loadingRecords ? (
                <p className="text-sm text-[#5c5346] py-6 text-center">
                  Loading live guest responses...
                </p>
              ) : filteredHostRecords.length === 0 ? (
                <p className="text-sm text-[#5c5346] py-6 text-center bg-[#fffaf0] border border-[#e5d2ab]">
                  {records.length === 0
                    ? 'No guests have submitted an RSVP yet. Responses submitted through this page will appear here immediately.'
                    : 'No guest entries match your current filter.'}
                </p>
              ) : (
                <div className="divide-y divide-[#e5d2ab] bg-[#fffaf0] border border-[#dfc38c]">
                  {filteredHostRecords.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h5 className="text-sm sm:text-base font-semibold text-[#1f1b18]">
                            {item.guestName}
                          </h5>
                          <span className="px-2 py-0.5 bg-[#f7ecd5] border border-[#dfc38c] text-[11px] font-semibold text-[#8b261d] tabular-nums">
                            {item.guestsCount} {item.guestsCount === 1 ? 'guest' : 'guests'}
                          </span>
                          <span className="text-[11px] text-[#7a684a]">
                            {item.createdAt
                              ? item.createdAt.toDate().toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Just now'}
                          </span>
                        </div>

                        <p className="text-xs text-[#5c5346] font-medium">
                          {item.events.join(' · ')}
                        </p>

                        {item.phone && (
                          <p className="text-xs text-[#6d5d45] tabular-nums">Tel: {item.phone}</p>
                        )}

                        {item.blessing && (
                          <p className="font-display italic text-base text-[#3b332b] pt-1">
                            “{item.blessing}”
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startHostEdit(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#c8b288] bg-[#fffaf0] text-xs font-medium text-[#3b332b] hover:border-[#8b261d] hover:text-[#8b261d] cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" aria-hidden="true" />
                          Edit
                        </button>

                        {pendingDeleteId === item.id ? (
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handleConfirmDelete(item.id)}
                              className="px-2.5 py-1.5 bg-[#8b261d] text-[#fff8e8] text-xs font-medium cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setPendingDeleteId(null)}
                              className="px-2 py-1.5 border border-[#c8b288] text-xs text-[#5c5346] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPendingDeleteId(item.id)}
                            aria-label={`Remove RSVP for ${item.guestName}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#c8b288] bg-[#fffaf0] text-xs font-medium text-[#5c5346] hover:border-[#b91c1c] hover:text-[#b91c1c] cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" aria-hidden="true" />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </ScrollReveal3D>
    </div>
  );
}
