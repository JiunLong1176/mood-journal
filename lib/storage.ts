'use client';

export interface Message {
  from: 'me' | 'ai';
  text: string;
  time: string;
}

export interface Entry {
  id: string;
  date: string;   // YYYY-MM-DD
  mood: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

const KEY = 'beans_entries';

function load(): Entry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

function save(entries: Entry[]) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

export function getAllEntries(): Entry[] {
  return load().sort((a, b) => b.date.localeCompare(a.date));
}

export function getEntry(date: string): Entry | null {
  return load().find(e => e.date === date) ?? null;
}

export function upsertEntry(date: string, mood: string, messages: Message[]): Entry {
  const entries = load();
  const idx = entries.findIndex(e => e.date === date);
  const now = new Date().toISOString();

  if (idx >= 0) {
    entries[idx] = { ...entries[idx], mood, messages, updatedAt: now };
    save(entries);
    return entries[idx];
  }

  const entry: Entry = {
    id: crypto.randomUUID(),
    date, mood, messages,
    createdAt: now,
    updatedAt: now,
  };
  entries.push(entry);
  save(entries);
  return entry;
}
