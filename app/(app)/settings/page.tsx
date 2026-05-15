'use client';
import { useState } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useUser } from '@/components/providers/UserProvider';
import { useTranslation } from '@/components/providers/LanguageProvider';
import { useEntries } from '@/components/providers/EntriesProvider';
import type { Language } from '@/components/providers/LanguageProvider';
import Header from '@/components/ui/Header';
import type { ThemeName } from '@/lib/themes';

const THEME_OPTIONS: { key: ThemeName; bg: string; circleBorder: string; labelColor: string }[] = [
  { key: 'cream',    bg: '#F7F2EA', circleBorder: 'rgba(0,0,0,0.18)',    labelColor: '#6B5F52' },
  { key: 'dusk',     bg: '#1A1614', circleBorder: 'rgba(255,255,255,0.3)', labelColor: 'rgba(255,255,255,0.45)' },
  { key: 'notebook', bg: '#FAF6EC', circleBorder: 'rgba(0,0,0,0.18)',    labelColor: '#6B5F52' },
];

const AI_TONE_KEYS = ['friend', 'reflective', 'spark', 'quiet'] as const;

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function SettingsPage() {
  const { theme, themeName, setTheme } = useTheme();
  const { username, avatarLetter, createdAt } = useUser();
  const { t, language, setLanguage } = useTranslation();
  const { entries } = useEntries();
  const [aiTone, setAiTone] = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('beans_ai_tone') ?? 'friend') : 'friend'
  );
  const [reminderOn, setReminderOn] = useState(true);
  const [reminderTime, setReminderTime] = useState('21:00');

  const entryCount = entries.length;
  let streak = 0;
  const _today = new Date();
  for (let i = 0; i < 60; i++) {
    const d = new Date(_today);
    d.setDate(d.getDate() - i);
    if (entries.find(e => e.date === dateKey(d))) streak++;
    else break;
  }

  const dateLocale = language === 'zh' ? 'zh-CN' : 'en-US';
  const memberSince = createdAt
    ? new Date(createdAt).toLocaleDateString(dateLocale, { month: 'short', year: 'numeric' })
    : '';

  return (
    <>
      <Header theme={theme} title={t.settings.headerTitle} />

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Profile header */}
        <div style={{
          background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 18,
          padding: 18, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: theme.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, fontWeight: 600, flexShrink: 0,
          }}>
            {avatarLetter}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="font-display" style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.3, color: theme.ink }}>{username}</div>
            <div style={{ fontSize: 12, color: theme.inkSoft, marginTop: 2 }}>
              {memberSince ? `${t.settings.memberSince(memberSince)} · ` : ''}{t.settings.entriesCount(entryCount)}
            </div>
          </div>
        </div>

        {/* Streak callout */}
        <div style={{
          background: theme.accentSoft, borderRadius: 16, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 28 }}>🔥</span>
          <div style={{ flex: 1 }}>
            {streak > 0 ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.ink }}>{t.settings.streakActive(streak)}</div>
                <div style={{ fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{t.settings.streakActiveSub}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.ink }}>{t.settings.streakNone}</div>
                <div style={{ fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{t.settings.streakNoneSub}</div>
              </>
            )}
          </div>
        </div>

        {/* Theme */}
        <SectionCard theme={theme} title={t.settings.themeTitle}>
          <div style={{ display: 'flex', gap: 10 }}>
            {THEME_OPTIONS.map(opt => (
              <button key={opt.key} onClick={() => setTheme(opt.key)} style={{
                flex: 1, padding: '12px 0', borderRadius: 12,
                border: `2px solid ${themeName === opt.key ? theme.accent : theme.line}`,
                background: opt.bg, cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: themeName === opt.key ? theme.accent : 'transparent',
                  border: `2px solid ${themeName === opt.key ? theme.accent : opt.circleBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {themeName === opt.key && <div style={{ width: 8, height: 8, borderRadius: 4, background: '#fff' }} />}
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: themeName === opt.key ? theme.accent : opt.labelColor }}>
                  {t.settings.themeNames[opt.key]}
                </span>
              </button>
            ))}
          </div>
        </SectionCard>

        {/* AI tone */}
        <SectionCard theme={theme} title={t.settings.aiTitle} subtitle={t.settings.aiSubtitle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {AI_TONE_KEYS.map(key => {
              const sel = aiTone === key;
              const tone = t.settings.aiTones[key];
              return (
                <button key={key} onClick={() => { setAiTone(key); localStorage.setItem('beans_ai_tone', key); }} style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                  background: sel ? theme.accentSoft : 'transparent',
                  border: `1px solid ${sel ? theme.accent : theme.line}`,
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    border: `2px solid ${sel ? theme.accent : theme.inkFaint}`,
                    background: sel ? theme.accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {sel && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: theme.ink }}>{tone.label}</div>
                    <div style={{ fontSize: 12, color: theme.inkSoft, marginTop: 1 }}>{tone.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* Language */}
        <SectionCard theme={theme} title={t.settings.languageTitle}>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['en', 'zh'] as Language[]).map(lang => {
              const sel = language === lang;
              return (
                <button key={lang} onClick={() => setLanguage(lang)} style={{
                  flex: 1, padding: '10px 0', borderRadius: 12,
                  border: `2px solid ${sel ? theme.accent : theme.line}`,
                  background: sel ? theme.accentSoft : 'transparent',
                  cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: 14, fontWeight: sel ? 600 : 400,
                  color: sel ? theme.accent : theme.inkSoft,
                }}>
                  {lang === 'en' ? t.settings.languageEN : t.settings.languageZH}
                </button>
              );
            })}
          </div>
        </SectionCard>

        {/* Reminder */}
        <SectionCard theme={theme} title={t.settings.reminderTitle}>
          <Row theme={theme} label={t.settings.reminderLabel} right={<Toggle on={reminderOn} onChange={setReminderOn} theme={theme} />} />
          {reminderOn && (
            <Row theme={theme} label={t.settings.reminderTime} last right={
              <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} style={{
                background: 'transparent', border: 'none', color: theme.ink, fontFamily: 'inherit', fontSize: 14, textAlign: 'right',
              }} />
            } />
          )}
        </SectionCard>

      </div>
    </>
  );
}

function SectionCard({ theme, title, subtitle, children }: { theme: any; title: string; subtitle?: string; children: React.ReactNode }) {
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

function Row({ theme, label, right, last }: { theme: any; label: string; right?: React.ReactNode; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0', borderBottom: last ? 'none' : `1px solid ${theme.line}`,
    }}>
      <span style={{ fontSize: 14, color: theme.ink }}>{label}</span>
      {right}
    </div>
  );
}

function Toggle({ on, onChange, theme }: { on: boolean; onChange: (v: boolean) => void; theme: any }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 13,
      background: on ? theme.accent : theme.surfaceAlt,
      position: 'relative', transition: 'background .2s',
      border: `1px solid ${theme.line}`, cursor: 'pointer',
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 10, background: '#fff',
        position: 'absolute', top: 2, left: on ? 21 : 2,
        transition: 'left .2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}
