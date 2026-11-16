import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export const RSVP_EVENT_OPTIONS = [
  'Haldi Ceremony (22 Nov)',
  'Wedding Muhurat (24 Nov)',
  'Dinner & Reception (24 Nov)',
  'Satyanarayan Pooja (26 Nov)',
] as const;

export type RsvpEventLabel = (typeof RSVP_EVENT_OPTIONS)[number];

export interface FirestoreRsvpRecord {
  id: string;
  guestName: string;
  phone: string;
  guestsCount: number;
  events: RsvpEventLabel[];
  blessing: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface RsvpPayloadInput {
  guestName: string;
  phone: string;
  guestsCount: number;
  events: string[];
  blessing: string;
}

function sanitizeRsvpInput(input: RsvpPayloadInput) {
  const guestName = input.guestName.trim().slice(0, 120);
  const phone = input.phone.trim().slice(0, 30);
  const guestsCount = Math.trunc(Math.max(1, Math.min(20, Number(input.guestsCount) || 1)));
  const validEvents = input.events.filter((item): item is RsvpEventLabel =>
    (RSVP_EVENT_OPTIONS as readonly string[]).includes(item)
  );
  const events: RsvpEventLabel[] =
    validEvents.length > 0 ? validEvents.slice(0, 4) : ['Wedding Muhurat (24 Nov)'];
  const blessing = input.blessing.trim().slice(0, 500);

  return { guestName, phone, guestsCount, events, blessing };
}

export function subscribeToHostRsvps(
  onData: (items: FirestoreRsvpRecord[]) => void,
  onError: (message: string) => void
): () => void {
  const rsvpsRef = collection(db, 'rsvps');
  const q = query(rsvpsRef, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: FirestoreRsvpRecord[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          guestName: typeof data.guestName === 'string' ? data.guestName : '',
          phone: typeof data.phone === 'string' ? data.phone : '',
          guestsCount: typeof data.guestsCount === 'number' ? data.guestsCount : 1,
          events: Array.isArray(data.events) ? (data.events as RsvpEventLabel[]) : [],
          blessing: typeof data.blessing === 'string' ? data.blessing : '',
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt : null,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt : null,
        };
      });

      onData(records);
    },
    (error) => {
      const msg = error instanceof Error ? error.message : String(error);
      if (msg.includes('Quota exceeded')) {
        onError(
          'Daily database read quota reached. Quota resets tomorrow, or upgrade the Firebase Spark plan in the console.'
        );
      } else {
        onError('Could not load RSVP records. Please refresh or sign in again.');
      }
      handleFirestoreError(error, OperationType.LIST, 'rsvps');
    }
  );
}

export async function createRsvpRecord(input: RsvpPayloadInput): Promise<string> {
  const sanitized = sanitizeRsvpInput(input);
  if (!sanitized.guestName) {
    throw new Error('Please enter your name or family name.');
  }

  const newRef = doc(collection(db, 'rsvps'));
  const path = `rsvps/${newRef.id}`;
  try {
    await setDoc(newRef, {
      guestName: sanitized.guestName,
      phone: sanitized.phone,
      guestsCount: sanitized.guestsCount,
      events: sanitized.events,
      blessing: sanitized.blessing,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return newRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateRsvpRecord(rsvpId: string, input: RsvpPayloadInput): Promise<void> {
  const sanitized = sanitizeRsvpInput(input);
  if (!sanitized.guestName) {
    throw new Error('Please enter your name or family name.');
  }

  const docRef = doc(db, 'rsvps', rsvpId);
  const path = `rsvps/${rsvpId}`;
  try {
    await updateDoc(docRef, {
      guestName: sanitized.guestName,
      phone: sanitized.phone,
      guestsCount: sanitized.guestsCount,
      events: sanitized.events,
      blessing: sanitized.blessing,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteRsvpRecord(rsvpId: string): Promise<void> {
  const docRef = doc(db, 'rsvps', rsvpId);
  const path = `rsvps/${rsvpId}`;
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function exportRsvpsToCsv(records: FirestoreRsvpRecord[]): void {
  const escapeCell = (val: string | number) => {
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const headers = [
    'Guest / Family Name',
    'Guests Count',
    'Ceremonies Attending',
    'Phone',
    'Blessing / Note',
    'Submitted At',
  ];

  const rows = records.map((r) => [
    escapeCell(r.guestName),
    escapeCell(r.guestsCount),
    escapeCell(r.events.join(' | ')),
    escapeCell(r.phone || '-'),
    escapeCell(r.blessing || ''),
    escapeCell(r.createdAt ? r.createdAt.toDate().toLocaleString('en-IN') : 'Just now'),
  ]);

  const csvContent = [headers.map(escapeCell).join(','), ...rows.map((r) => r.join(','))].join(
    '\r\n'
  );
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'Vinayak_Ruchi_Guest_List.csv';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
