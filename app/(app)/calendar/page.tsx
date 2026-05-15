'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { useEntries } from '@/components/providers/EntriesProvider';
import Header from '@/components/ui/Header';
import { MOODS, MOOD_BY_KEY } from '@/lib/moods';
function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function CalendarPage() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const { entries, loading } = useEntries();
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const entriesByDate = Object.fromEntries(entries.map(e => [e.date, e]));
  const today = new Date();
  const todayStr = dayKey(today);

  const dateLocale = language === 'zh' ? 'zh-CN' : 'en-US';
  const monthLabel = viewMonth.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' });
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay.getDay(); i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const monthEntries = entries.filter(e => e.date.startsWith(
    `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}`
  ));
  const moodCount: Record<string, number> = {};
  monthEntries.forEach(e => { moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
  const totalLogged = monthEntries.length;

  return (
    <>
      <Header theme={theme} title={t.calendar.title} subtitle={t.calendar.subtitle(totalLogged)} />

      <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <NavBtn theme={theme} dir="left" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} />
        <div className="font-display" style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, color: theme.ink }}>{monthLabel}</div>
        <NavBtn theme={theme} dir="right" onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6, padding: '0 4px' }}>
          {t.calendar.weekdays.map((w, i) => (
            <div key={i} className="font-mono" style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: theme.inkFaint, letterSpacing: 0.6 }}>{w}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {loading && Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="animate-shimmer" style={{
              aspectRatio: '1', borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(90deg, ${theme.surfaceAlt} 25%, ${theme.surface} 50%, ${theme.surfaceAlt} 75%)`,
              backgroundSize: '200% 100%',
            }} />
          ))}
          {!loading && cells.map((d, i) => {
            if (!d) return <div key={i} style={{ aspectRatio: '1' }} />;
            const k = dayKey(d);
            const entry = entriesByDate[k];
            const mood = entry ? MOOD_BY_KEY[entry.mood as keyof typeof MOOD_BY_KEY] : null;
            const isToday = k === todayStr;
            const isFuture = d > today;

            const cell = (
              <div style={{
                aspectRatio: '1', borderRadius: 12,
                background: mood ? mood.color + '22' : theme.surface,
                border: isToday ? `1.5px solid ${theme.accent}` : `1px solid ${theme.line}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                opacity: isFuture ? 0.35 : 1,
                cursor: entry ? 'pointer' : 'default',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 9, fontWeight: 600, color: theme.inkFaint }}>{d.getDate()}</div>
                {mood
                  ? <span style={{ fontSize: 22, lineHeight: 1, marginTop: 4 }}>{mood.emoji}</span>
                  : !isFuture && <span style={{ width: 4, height: 4, borderRadius: 2, background: theme.inkFaint, opacity: .3, marginTop: 6, display: 'block' }} />
                }
              </div>
            );

            return entry
              ? <Link key={i} href={`/archive/${k}`} style={{ textDecoration: 'none' }}>{cell}</Link>
              : <div key={i}>{cell}</div>;
          })}

        </div>

        <div style={{ marginTop: 24, background: theme.surface, borderRadius: 16, padding: 16, border: `1px solid ${theme.line}` }}>
          <div className="font-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: theme.inkFaint, marginBottom: 12 }}>{t.calendar.thisMonth}</div>
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 14, background: theme.surfaceAlt }}>
            {MOODS.map(m => {
              const pct = totalLogged ? (moodCount[m.key] || 0) / totalLogged * 100 : 0;
              return pct > 0 ? <div key={m.key} style={{ width: pct + '%', background: m.color }} /> : null;
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px' }}>
            {MOODS.map(m => (
              <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: theme.inkSoft }}>
                <span style={{ fontSize: 14 }}>{m.emoji}</span>
                <span style={{ color: theme.ink, fontWeight: 600 }}>{moodCount[m.key] || 0}</span>
                <span>{t.moods[m.key]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function NavBtn({ theme, dir, onClick }: { theme: any; dir: 'left' | 'right'; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 16, background: theme.surface,
      border: `1px solid ${theme.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: theme.ink, cursor: 'pointer',
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {dir === 'left' ? <path d="M9 3L5 7l4 4" /> : <path d="M5 3l4 4-4 4" />}
      </svg>
    </button>
  );
}
