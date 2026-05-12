'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTranslation } from '@/components/providers/LanguageProvider';
import Header from '@/components/ui/Header';
import { MOODS, MOOD_BY_KEY } from '@/lib/moods';
import type { MoodKey } from '@/lib/moods';
import type { Entry } from '@/lib/storage';

function SkeletonBlock({ width, height, borderRadius = 6, theme }: {
  width: string | number; height: number; borderRadius?: number; theme: any;
}) {
  return (
    <div
      className="animate-shimmer"
      style={{
        width, height, borderRadius, flexShrink: 0,
        background: `linear-gradient(90deg, ${theme.surfaceAlt} 25%, ${theme.surface} 50%, ${theme.surfaceAlt} 75%)`,
        backgroundSize: '200% 100%',
      }}
    />
  );
}

function SkeletonCard({ theme }: { theme: any }) {
  return (
    <div style={{
      background: theme.surface,
      border: `1px solid ${theme.line}`,
      borderRadius: 14, padding: 14,
      display: 'flex', gap: 12, alignItems: 'flex-start',
    }}>
      <SkeletonBlock width={40} height={40} borderRadius={20} theme={theme} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SkeletonBlock width={120} height={13} borderRadius={4} theme={theme} />
          <SkeletonBlock width={50} height={11} borderRadius={4} theme={theme} />
        </div>
        <SkeletonBlock width="85%" height={14} borderRadius={4} theme={theme} />
      </div>
    </div>
  );
}

export default function ArchivePage() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [search, setSearch] = useState('');
  const [moodFilter, setMoodFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/entries').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setEntries(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = entries.filter(e => {
    if (moodFilter && e.mood !== moodFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return e.messages.some(m => m.text.toLowerCase().includes(q));
    }
    return true;
  });

  const groups: Record<string, Entry[]> = {};
  filtered.forEach(e => {
    const key = e.date.slice(0, 7);
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });

  return (
    <>
      <Header theme={theme} title={t.archive.title} subtitle={t.archive.subtitle(entries.length)} />

      <div style={{ padding: '0 16px 12px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: theme.surface, borderRadius: 14, padding: '8px 12px',
          border: `1px solid ${theme.line}`,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={theme.inkFaint} strokeWidth="1.8" strokeLinecap="round">
            <circle cx="6" cy="6" r="4" /><path d="M10 10l2.5 2.5" />
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.archive.searchPlaceholder}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: theme.ink, fontFamily: 'inherit', fontSize: 14 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          <FilterPill active={!moodFilter} label={t.archive.filterAll} onClick={() => setMoodFilter(null)} theme={theme} />
          {MOODS.map(m => (
            <FilterPill key={m.key} active={moodFilter === m.key} label={`${m.emoji} ${t.moods[m.key]}`}
              onClick={() => setMoodFilter(moodFilter === m.key ? null : m.key)} theme={theme} />
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[0, 1, 2, 3].map(i => <SkeletonCard key={i} theme={theme} />)}
          </div>
        ) : (
          <div className="animate-fadein">
            {Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)).map(([month, monthEntries]) => {
              const [year, mo] = month.split('-');
              const dateLocale = language === 'zh' ? 'zh-CN' : 'en-US';
              const label = new Date(+year, +mo - 1, 1).toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' });
              return (
                <div key={month} style={{ marginBottom: 16 }}>
                  <div className="font-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 8 }}>{label}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {monthEntries.map(e => {
                      const mood = MOOD_BY_KEY[e.mood as keyof typeof MOOD_BY_KEY];
                      const preview = e.messages.find(m => m.from === 'me')?.text ?? '';
                      const dateLabel = new Date(e.date + 'T12:00:00').toLocaleDateString(dateLocale, { weekday: 'short', month: 'short', day: 'numeric' });
                      return (
                        <Link key={e.id} href={`/archive/${e.date}`} style={{ textDecoration: 'none' }}>
                          <div style={{
                            background: theme.surface, border: `1px solid ${theme.line}`,
                            borderRadius: 14, padding: 14,
                            display: 'flex', gap: 12, alignItems: 'flex-start',
                          }}>
                            <div style={{
                              width: 40, height: 40, borderRadius: 20, flexShrink: 0,
                              background: mood.color + '22',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                            }}>{mood.emoji}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: theme.ink }}>{dateLabel}</span>
                                <span style={{ fontSize: 11, color: theme.inkFaint }}>{t.moods[e.mood as MoodKey]}</span>
                              </div>
                              <div style={{ fontSize: 14, color: theme.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview}</div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: 'center', color: theme.inkFaint, padding: 40, fontSize: 14 }}>
                {entries.length === 0 ? t.archive.emptyNoEntries : t.archive.emptyFiltered}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function FilterPill({ active, label, onClick, theme }: { active: boolean; label: string; onClick: () => void; theme: any }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 20, flexShrink: 0,
      background: active ? theme.accent : theme.surface,
      color: active ? '#fff' : theme.inkSoft,
      border: `1px solid ${active ? theme.accent : theme.line}`,
      fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
    }}>{label}</button>
  );
}
