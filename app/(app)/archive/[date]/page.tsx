'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { Bubble, type Message } from '@/components/ui/Bubble';
import { MOOD_BY_KEY } from '@/lib/moods';
import type { MoodKey } from '@/lib/moods';

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

export default function EntryPage() {
  const { date } = useParams<{ date: string }>();
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { t, language } = useTranslation();
  const [entry, setEntry] = useState<{ mood: string; messages: Message[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/entries?date=${date}`)
      .then(r => r.json())
      .then(e => {
        if (e) setEntry(e);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [date]);

  const dateLocale = language === 'zh' ? 'zh-CN' : 'en-US';
  const dateLabel = new Date(date + 'T12:00:00').toLocaleDateString(dateLocale, { weekday: 'long', month: 'long', day: 'numeric' });
  const mood = entry ? MOOD_BY_KEY[entry.mood as MoodKey] : null;

  return (
    <>
      {/* Header — back button and date always visible */}
      <div style={{ padding: '12px 20px 14px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => router.back()} style={{
          width: 36, height: 36, borderRadius: 18, background: theme.surface,
          border: `1px solid ${theme.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: theme.ink, cursor: 'pointer',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M10 3L6 8l4 5" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <div className="font-mono" style={{ fontSize: 10, color: theme.inkFaint, letterSpacing: 0.6, textTransform: 'uppercase' }}>{dateLabel}</div>
          <div style={{ marginTop: 4 }}>
            {loading ? (
              <SkeletonBlock width={140} height={22} borderRadius={8} theme={theme} />
            ) : mood ? (
              <div className="animate-fadein" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 20 }}>{mood.emoji}</span>
                <span className="font-display" style={{ fontSize: 20, fontWeight: 500, color: theme.ink }}>{t.moods[mood.key as MoodKey]}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {loading ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SkeletonBlock width="60%" height={44} borderRadius={20} theme={theme} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <SkeletonBlock width="72%" height={60} borderRadius={20} theme={theme} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SkeletonBlock width="45%" height={44} borderRadius={20} theme={theme} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <SkeletonBlock width="65%" height={80} borderRadius={20} theme={theme} />
            </div>
          </>
        ) : !entry ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: theme.inkFaint }}>
            {t.entryDetail.notFound}
          </div>
        ) : (
          <div className="animate-fadein" style={{ display: 'contents' }}>
            {entry.messages.map((m, i) => (
              <Bubble key={i} msg={m} theme={theme} themeName={themeName} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
