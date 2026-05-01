'use client';
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useTranslation } from '@/components/providers/LanguageProvider';
import Header from '@/components/ui/Header';
import { MOODS } from '@/lib/moods';
import type { MoodKey } from '@/lib/moods';
type Entry = { date: string; mood: string; messages: { from: string; text: string }[] };

function dayKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function InsightsPage() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('/api/entries').then(r => r.json()).then(data => { if (Array.isArray(data)) setEntries(data); });
  }, []);

  const today = new Date();
  const last30 = entries.filter(e => {
    const d = new Date(e.date + 'T12:00:00');
    return (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24) < 30;
  });

  const moodCount: Record<string, number> = {};
  last30.forEach(e => { moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
  const total = last30.length;
  const topMood = [...MOODS].sort((a, b) => (moodCount[b.key] || 0) - (moodCount[a.key] || 0))[0] ?? MOODS[1];

  // Streak
  const byDate = Object.fromEntries(entries.map(e => [e.date, e]));
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (byDate[dayKey(d)]) streak++; else break;
  }

  // Word cloud
  const stop = new Set('the a an and but or so to of for on in at with from is was were be been are i my me you we it that this just like really very still feel felt have had has got get all about up down out off as if not no'.split(' '));
  const freq: Record<string, number> = {};
  last30.forEach(e => e.messages.filter(m => m.from === 'me').forEach(m => {
    m.text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).forEach(w => {
      if (w.length < 4 || stop.has(w)) return;
      freq[w] = (freq[w] || 0) + 1;
    });
  }));
  const words = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 14);
  const maxF = words[0]?.[1] || 1;

  // Day-of-week avg
  const moodScore: Record<string, number> = { rad: 5, good: 4, meh: 3, down: 2, awful: 1 };
  const dows = [0, 0, 0, 0, 0, 0, 0];
  const dowCount = [0, 0, 0, 0, 0, 0, 0];
  last30.forEach(e => {
    const d = new Date(e.date + 'T12:00:00').getDay();
    dows[d] += moodScore[e.mood] ?? 3; dowCount[d]++;
  });
  const dowAvg = dows.map((s, i) => dowCount[i] ? s / dowCount[i] : 0);
  const dowMax = Math.max(...dowAvg, 1);

  if (entries.length === 0) return (
    <>
      <Header theme={theme} title={t.insights.title} subtitle={t.insights.subtitle} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center' }}>
        <div className="font-display" style={{ fontSize: 18, fontStyle: 'italic', color: theme.inkSoft, maxWidth: 240, lineHeight: 1.4 }}>
          {t.insights.emptyState}
        </div>
      </div>
    </>
  );

  return (
    <>
      <Header theme={theme} title={t.insights.title} subtitle={t.insights.subtitle} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: theme.accent, color: '#fff', borderRadius: 20, padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>{topMood.emoji}</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', opacity: .8 }}>{t.insights.mostly}</div>
            <div className="font-display" style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.05 }}>{t.insights.daysLabel(t.moods[topMood.key as MoodKey])}</div>
            <div style={{ fontSize: 13, opacity: .85, marginTop: 2 }}>{t.insights.ofLast(moodCount[topMood.key] ?? 0, total)}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard theme={theme} label={t.insights.streakLabel} value={streak} unit={t.insights.streakUnit(streak)} icon="🔥" />
          <StatCard theme={theme} label={t.insights.totalLabel} value={entries.length} unit={t.insights.totalUnit} icon="📝" />
        </div>

        <Card theme={theme} title={t.insights.moodBreakdown}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOODS.map(m => {
              const c = moodCount[m.key] || 0;
              const pct = total ? (c / total) * 100 : 0;
              return (
                <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, width: 22 }}>{m.emoji}</span>
                  <div style={{ flex: 1, height: 8, background: theme.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: pct + '%', height: '100%', background: m.color, transition: 'width .4s' }} />
                  </div>
                  <span className="font-mono" style={{ fontSize: 11, color: theme.inkSoft, minWidth: 28, textAlign: 'right' }}>{c}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card theme={theme} title={t.insights.byDayOfWeek} subtitle={t.insights.byDaySubtitle}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginTop: 4 }}>
            {t.insights.weekdays.map((w, i) => {
              const v = dowAvg[i];
              const h = (v / dowMax) * 84;
              const hue = v >= 4 ? theme.sage : v >= 3 ? theme.accent : theme.inkFaint;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', height: h, background: hue, borderRadius: 6, opacity: v ? 1 : .15, transition: 'height .4s' }} />
                  </div>
                  <span className="font-mono" style={{ fontSize: 10, color: theme.inkFaint, fontWeight: 600 }}>{w}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {words.length > 0 && (
          <Card theme={theme} title={t.insights.wordCloud}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', alignItems: 'baseline', paddingTop: 4 }}>
              {words.map(([w, c]) => {
                const ratio = c / maxF;
                return (
                  <span key={w} className="font-display" style={{
                    fontSize: 12 + ratio * 16, color: theme.ink, opacity: 0.5 + ratio * 0.5,
                    fontWeight: ratio > 0.6 ? 500 : 400, fontStyle: ratio > 0.4 ? 'italic' : 'normal', letterSpacing: -0.3,
                  }}>{w}</span>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </>
  );
}

function StatCard({ theme, label, value, unit, icon }: { theme: any; label: string; value: number; unit: string; icon: string }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 16, padding: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span className="font-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: theme.inkFaint }}>{label}</span>
        <span style={{ fontSize: 16 }}>{icon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className="font-display" style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.8, color: theme.ink, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 12, color: theme.inkSoft }}>{unit}</span>
      </div>
    </div>
  );
}

function Card({ theme, title, subtitle, children }: { theme: any; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 16, padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.2, color: theme.ink }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: theme.inkFaint, marginTop: 1 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}
