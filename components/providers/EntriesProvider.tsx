'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Entry } from '@/lib/storage';

interface EntriesContextValue {
  entries: Entry[];
  loading: boolean;
  refresh: () => void;
}

const EntriesContext = createContext<EntriesContextValue>({
  entries: [],
  loading: true,
  refresh: () => {},
});

export function EntriesProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntries = useCallback(() => {
    setLoading(true);
    fetch('/api/entries')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setEntries(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchEntries(); }, [fetchEntries]);

  return (
    <EntriesContext.Provider value={{ entries, loading, refresh: fetchEntries }}>
      {children}
    </EntriesContext.Provider>
  );
}

export function useEntries() { return useContext(EntriesContext); }
