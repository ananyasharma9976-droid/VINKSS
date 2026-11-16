import {
  CalendarPlus,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { INVITATION_DATA } from '../data/invitationData';
import { downloadEventsIcs } from '../utils/invitationTools';
import { Interactive3DCard } from './Interactive3DCard';
import { ResilientImage } from './ResilientImage';
import { ScrollReveal3D, ScrollReveal3DItem } from './ScrollReveal3D';

interface CeremonyTheme {
  cardBg: string;
  border: string;
  accentText: string;
  topStripe: string;
  plaqueBg: string;
  plaqueBorder: string;
  plaqueRibbon: string;
  dayNum: string;
  monthYear: string;
  weekday: string;
  marathiName: string;
  attireNote: string;
}

const CEREMONY_META: Record<string, CeremonyTheme> = {
  haldi: {
    cardBg: 'bg-gradient-to-r from-[#fff9e2] to-[#fef0c4]',
    border: 'border-[#e6bf63]',
    accentText: 'text-[#a14608]',
    topStripe: 'border-t-4 border-t-[#d97706]',
    plaqueBg: 'bg-gradient-to-b from-[#fffdf4] to-[#fbe8ad]',
    plaqueBorder: 'border-[#d99b26]',
    plaqueRibbon: 'bg-[#b45309] text-[#fff8e6]',
    dayNum: '22',
    monthYear: 'NOV 2026',
    weekday: 'SUNDAY',
    marathiName: 'हळद समारंभ',
    attireNote: 'Festive Yellows & Marigold Shades',
  },
  wedding: {
    cardBg: 'bg-gradient-to-r from-[#fff4f0] to-[#fde4dc]',
    border: 'border-[#dfaa9f]',
    accentText: 'text-[#8b261d]',
    topStripe: 'border-t-4 border-t-[#8b261d]',
    plaqueBg: 'bg-gradient-to-b from-[#fffaf8] to-[#f8d7ce]',
    plaqueBorder: 'border-[#9e2b20]',
    plaqueRibbon: 'bg-[#8b261d] text-[#fff8e8]',
    dayNum: '24',
    monthYear: 'NOV 2026',
    weekday: 'TUESDAY',
    marathiName: 'शुभमंगल मुहूर्त',
    attireNote: 'Traditional Maharashtrian Silk & Festive Wear',
  },
  reception: {
    cardBg: 'bg-gradient-to-r from-[#f0f9f4] to-[#ddf0e6]',
    border: 'border-[#9ec8b3]',
    accentText: 'text-[#1d5e4a]',
    topStripe: 'border-t-4 border-t-[#1d5e4a]',
    plaqueBg: 'bg-gradient-to-b from-[#f9fdfb] to-[#d2ebde]',
    plaqueBorder: 'border-[#25735b]',
    plaqueRibbon: 'bg-[#1d5e4a] text-[#f3fcf7]',
    dayNum: '24',
    monthYear: 'NOV 2026',
    weekday: 'TUESDAY',
    marathiName: 'स्नेहभोजन व स्वागत',
    attireNote: 'Evening Ethnic & Celebration Attire',
  },
  pooja: {
    cardBg: 'bg-gradient-to-r from-[#fdf6e7] to-[#f7e7c5]',
    border: 'border-[#d7b676]',
    accentText: 'text-[#874d12]',
    topStripe: 'border-t-4 border-t-[#c0842b]',
    plaqueBg: 'bg-gradient-to-b from-[#fffcf4] to-[#f3dcad]',
    plaqueBorder: 'border-[#b8822c]',
    plaqueRibbon: 'bg-[#8c5416] text-[#fff8e8]',
    dayNum: '26',
    monthYear: 'NOV 2026',
    weekday: 'THURSDAY',
    marathiName: 'श्री सत्यनारायण पूजा',
    attireNote: 'Traditional Morning Pooja Attire',
  },
};

type DateFilterKey = 'all' | '22' | '24' | '26';

const DATE_FILTERS: {
  key: DateFilterKey;
  dayDisplay: string;
  subLabel: string;
  caption: string;
}[] = [
  { key: 'all', dayDisplay: 'All', subLabel: '4 Celebrations', caption: 'Full Itinerary' },
  { key: '22', dayDisplay: '22', subLabel: 'Nov · Sun', caption: 'Haldi' },
  { key: '24', dayDisplay: '24', subLabel: 'Nov · Tue', caption: 'Vivah & Dinner' },
  { key: '26', dayDisplay: '26', subLabel: 'Nov · Thu', caption: 'Satyanarayan' },
];

const EXPAND_SPRING = {
  type: 'spring' as const,
  stiffness: 255,
  damping: 25,
  mass: 0.88,
};

export function CeremoniesView() {
  const prefersReducedMotion = useReducedMotion();
  const [savedId, setSavedId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<DateFilterKey>('all');
  const [expandedIds, setExpandedIds] = useState<string[]>(['wedding']);

  const handleSaveSingle = (eventId: string) => {
    const found = INVITATION_DATA.events.find((e) => e.id === eventId);
    if (!found) return;
    downloadEventsIcs([found], `Vinayak_Ruchi_${found.id}.ics`);
    setSavedId(eventId);
    window.setTimeout(() => setSavedId(null), 2200);
  };

  const handleSaveAll = () => {
    downloadEventsIcs(INVITATION_DATA.events, 'Vinayak_Ruchi_All_Ceremonies.ics');
    setSavedId('all');
    window.setTimeout(() => setSavedId(null), 2200);
  };

  const toggleDetails = (eventId: string) => {
    setExpandedIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  const handleSelectDateFilter = (dateKey: DateFilterKey) => {
    setSelectedDate(dateKey);
    if (dateKey === 'all') return;
    const matchingIds = INVITATION_DATA.events
      .filter((ev) => CEREMONY_META[ev.id]?.dayNum === dateKey)
      .map((ev) => ev.id);
    if (matchingIds.length > 0) {
      setExpandedIds((prev) => Array.from(new Set([...prev, ...matchingIds])));
    }
  };

  const visibleEvents =
    selectedDate === 'all'
      ? INVITATION_DATA.events
      : INVITATION_DATA.events.filter((ev) => CEREMONY_META[ev.id]?.dayNum === selectedDate);

  return (
    <div>
      <ScrollReveal3D direction="up" stagger staggerInterval={0.075} delayChildren={0.04}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#dfc89e]">
          <div className="flex items-center gap-4 sm:gap-5">
            <ScrollReveal3DItem kind="media" className="shrink-0">
              <ResilientImage
                src="/assets/images/mangal_kalash_diya.png"
                alt="Engraved brass Mangal Kalash with coconut, mango leaves, jasmine, haldi-kumkum bowls and lit diya"
                fallbackLabel="Mangal Kalash"
                className="w-20 sm:w-28 h-auto object-contain shrink-0 select-none"
              />
            </ScrollReveal3DItem>
            <ScrollReveal3DItem kind="text">
              <p className="font-royal text-xs tracking-[0.14em] text-[#b45309] font-semibold">
                Celebration Itinerary
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#1f1b18] mt-1">
                Ceremonies &amp; Auspicious Timings
              </h2>
            </ScrollReveal3DItem>
          </div>

          <ScrollReveal3DItem kind="action">
            <button
              type="button"
              onClick={handleSaveAll}
              className="inline-flex items-center justify-center gap-2 min-h-[42px] px-4 py-2 bg-[#8b261d] text-[#faf7f0] text-xs sm:text-sm font-medium hover:bg-[#731e17] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]"
            >
              {savedId === 'all' ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Saved All Events
                </>
              ) : (
                <>
                  <CalendarPlus className="w-4 h-4" aria-hidden="true" />
                  Save All Events
                </>
              )}
            </button>
          </ScrollReveal3DItem>
        </div>
      </ScrollReveal3D>

      {/* Bold Interactive Wedding Dates Selector Bar */}
      <ScrollReveal3D direction="up" delay={0.05} className="mt-6">
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3"
          role="tablist"
          aria-label="Filter ceremonies by wedding date"
        >
          {DATE_FILTERS.map((item) => {
            const active = selectedDate === item.key;
            return (
              <motion.button
                key={item.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => handleSelectDateFilter(item.key)}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                className={`relative text-left px-3.5 py-3 border transition-colors cursor-pointer overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d] ${
                  active
                    ? 'border-[#8b261d] text-[#fffaf0] shadow-[0_10px_22px_rgba(139,38,29,0.2)]'
                    : 'bg-[#fffaf0]/90 border-[#d6be8c] text-[#2e2822] hover:border-[#b6791e]'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="ceremony-date-highlight"
                    transition={{ type: 'spring', stiffness: 340, damping: 28 }}
                    className="absolute inset-0 bg-gradient-to-br from-[#8b261d] via-[#751c15] to-[#5a120d]"
                    aria-hidden="true"
                  />
                )}
                <div className="relative z-10 flex items-center gap-3">
                  <span
                    className={`font-display text-2xl sm:text-3xl font-extrabold leading-none tabular-nums ${
                      active ? 'text-[#f5d892]' : 'text-[#8b261d]'
                    }`}
                  >
                    {item.dayDisplay}
                  </span>
                  <div className="min-w-0">
                    <p
                      className={`font-royal text-[10px] tracking-[0.14em] uppercase font-semibold truncate ${
                        active ? 'text-[#f3dfb1]' : 'text-[#7a6136]'
                      }`}
                    >
                      {item.subLabel}
                    </p>
                    <p
                      className={`text-xs font-semibold truncate mt-0.5 ${
                        active ? 'text-[#ffffff]' : 'text-[#1f1b18]'
                      }`}
                    >
                      {item.caption}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </ScrollReveal3D>

      {/* Ceremony Cards with Bold Date Plaques & Spring-Animated Detail Expansion */}
      <div className="mt-6 space-y-5">
        {visibleEvents.map((event, index) => {
          const meta = CEREMONY_META[event.id] ?? CEREMONY_META.haldi;
          const isExpanded = expandedIds.includes(event.id);
          const itineraryNumber =
            INVITATION_DATA.events.findIndex((item) => item.id === event.id) + 1;

          return (
            <ScrollReveal3D key={event.id} direction="fade-in-up" delay={index * 0.05}>
              <Interactive3DCard maxTilt={3.5}>
                <article
                  className={`border ${meta.cardBg} ${meta.border} ${meta.topStripe} shadow-[0_12px_28px_rgba(92,28,20,0.08)] overflow-hidden`}
                >
                  <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-[192px_1fr_auto] gap-4 md:gap-6 items-center">
                    {/* Bold Interactive Royal Date & Timing Plaque */}
                    <motion.button
                      type="button"
                      onClick={() => toggleDetails(event.id)}
                      whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
                      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                      aria-expanded={isExpanded}
                      aria-label={`${event.title} on ${event.dateLabel}. Click to ${
                        isExpanded ? 'collapse' : 'expand'
                      } ceremony details.`}
                      className={`group text-center border-2 ${meta.plaqueBg} ${meta.plaqueBorder} shadow-[0_8px_18px_rgba(78,24,18,0.1)] overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]`}
                    >
                      <div
                        className={`px-3 py-1.5 font-royal text-[10px] tracking-[0.18em] font-semibold flex items-center justify-between ${meta.plaqueRibbon}`}
                      >
                        <span>{meta.weekday}</span>
                        <span>{meta.monthYear}</span>
                      </div>

                      <div className="px-4 py-3 flex md:flex-col items-center justify-between md:justify-center gap-3 md:gap-1">
                        <span
                          className={`font-display text-5xl sm:text-[3.5rem] font-extrabold leading-none tabular-nums tracking-tight ${meta.accentText} group-hover:scale-105 transition-transform`}
                        >
                          {meta.dayNum}
                        </span>

                        <div className="text-right md:text-center md:mt-1.5 md:pt-2 md:border-t md:border-[#d9c192]/80 md:w-full">
                          <span
                            className={`inline-flex items-center gap-1 text-xs sm:text-[13px] font-bold tabular-nums ${meta.accentText}`}
                          >
                            <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                            {event.timeLabel}
                          </span>
                          <p className="font-marathi text-[11px] font-semibold text-[#5c4022] mt-0.5">
                            {meta.marathiName}
                          </p>
                        </div>
                      </div>
                    </motion.button>

                    {/* Core Ceremony Summary */}
                    <div className="min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleDetails(event.id)}
                        className="w-full text-left group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`font-royal text-[11px] tracking-[0.14em] uppercase font-semibold ${meta.accentText}`}
                          >
                            0{itineraryNumber}. {event.dateLabel}
                          </span>
                        </div>
                        <h3 className="font-display text-2xl sm:text-[28px] font-bold text-[#1f1b18] leading-snug mt-0.5 group-hover:text-[#8b261d] transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-[#5c5346] mt-0.5">{event.subtitle}</p>
                        <p className="text-sm text-[#3b332b] mt-2 inline-flex items-center gap-1.5">
                          <MapPin className={`w-3.5 h-3.5 shrink-0 ${meta.accentText}`} aria-hidden="true" />
                          <span className="font-semibold text-[#1f1b18]">{event.venueName}</span>
                          <span className="text-[#8a7043] hidden sm:inline">·</span>
                          <span className="text-[#5c5346] hidden sm:inline truncate">
                            {event.venueShort}
                          </span>
                        </p>
                      </button>
                    </div>

                    {/* Action Controls + Fluid Spring Chevron Toggle */}
                    <div className="flex flex-wrap md:flex-col items-center md:items-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleSaveSingle(event.id)}
                        className="inline-flex items-center gap-1.5 min-h-[40px] px-3.5 py-2 border border-[#c8b288] bg-[#fffaf0]/95 text-[#1f1b18] text-xs font-medium hover:border-[#8b261d] hover:text-[#8b261d] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d]"
                      >
                        {savedId === event.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#8b261d]" aria-hidden="true" />
                            Added to Calendar
                          </>
                        ) : (
                          <>
                            <CalendarPlus className="w-3.5 h-3.5" aria-hidden="true" />
                            Add to Calendar
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleDetails(event.id)}
                        aria-expanded={isExpanded}
                        className={`inline-flex items-center gap-1.5 min-h-[38px] px-3.5 py-1.5 border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b261d] ${
                          isExpanded
                            ? 'bg-[#8b261d] text-[#fff8e8] border-[#8b261d]'
                            : 'bg-[#fffaf0]/80 text-[#5c3b1e] border-[#d3b682] hover:border-[#8b261d] hover:text-[#8b261d]'
                        }`}
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Ceremony Details'}</span>
                        <motion.span
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={
                            prefersReducedMotion
                              ? { duration: 0.01 }
                              : { type: 'spring', stiffness: 320, damping: 22 }
                          }
                          className="inline-flex items-center"
                          aria-hidden="true"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      </button>
                    </div>
                  </div>

                  {/* Spring-Based Expandable Ceremony Details Drawer */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="details"
                        initial={
                          prefersReducedMotion
                            ? { opacity: 1, height: 'auto' }
                            : { opacity: 0, height: 0 }
                        }
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={
                          prefersReducedMotion
                            ? { opacity: 0, height: 0 }
                            : { opacity: 0, height: 0 }
                        }
                        transition={
                          prefersReducedMotion
                            ? { duration: 0.01 }
                            : {
                                height: EXPAND_SPRING,
                                opacity: { duration: 0.28, ease: 'easeOut' },
                              }
                        }
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={prefersReducedMotion ? false : { y: -10, scale: 0.985 }}
                          animate={{ y: 0, scale: 1 }}
                          exit={prefersReducedMotion ? undefined : { y: -8, scale: 0.985 }}
                          transition={
                            prefersReducedMotion ? { duration: 0.01 } : EXPAND_SPRING
                          }
                          className="px-4 sm:px-6 pb-5 pt-4 border-t border-[#dfc89e]/80 bg-[#fffaf0]/70 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center"
                        >
                          <div className="space-y-2 text-sm text-[#3b332b]">
                            <p className="leading-relaxed">{event.description}</p>

                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-xs text-[#5c5346]">
                              <span className="inline-flex items-center gap-1.5">
                                <Sparkles
                                  className={`w-3.5 h-3.5 shrink-0 ${meta.accentText}`}
                                  aria-hidden="true"
                                />
                                <span>
                                  <strong className="font-semibold text-[#1f1b18]">Attire:</strong>{' '}
                                  {meta.attireNote}
                                </span>
                              </span>
                              <span>
                                <strong className="font-semibold text-[#1f1b18]">Address:</strong>{' '}
                                {event.addressLines.join(' ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-start md:justify-end">
                            <a
                              href={event.mapQuery}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 min-h-[40px] px-4 py-2 bg-[#fffaf0] border border-[#c89b44] text-xs font-semibold text-[#8b261d] hover:bg-[#8b261d] hover:text-[#fff8e8] transition-colors whitespace-nowrap shrink-0"
                            >
                              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                              Get Directions
                              <ExternalLink className="w-3 h-3" aria-hidden="true" />
                            </a>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              </Interactive3DCard>
            </ScrollReveal3D>
          );
        })}
      </div>
    </div>
  );
}

