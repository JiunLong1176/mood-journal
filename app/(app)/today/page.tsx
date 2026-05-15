'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useUser } from '@/components/providers/UserProvider';
import { useEntries } from '@/components/providers/EntriesProvider';
import MoodStrip from '@/components/ui/MoodStrip';
import { Bubble, TypingBubble, type Message } from '@/components/ui/Bubble';
import { MoodKey, MOOD_BY_KEY } from '@/lib/moods';
import { useTranslation } from '@/components/providers/LanguageProvider';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TodayPage() {
  const { theme, themeName } = useTheme();
  const { username, avatarLetter } = useUser();
  const { entries: allEntries, refresh } = useEntries();
  const { t, language } = useTranslation();
  const router = useRouter();
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(todayKey());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerEntries, setPickerEntries] = useState<Record<string, string>>({});
  const [pickerMonth, setPickerMonth] = useState<Date>(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dateLocale = language === 'zh' ? 'zh-CN' : 'en-US';
  const selectedDateLabel = parseDateKey(selectedDate).toLocaleDateString(dateLocale, { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = new Date().getHours();

  function loadEntry(date: string) {
    setLoaded(false);
    fetch(`/api/entries?date=${date}`)
      .then(r => r.json())
      .then(entry => {
        if (entry && entry.mood) {
          setMood(entry.mood as MoodKey);
          setMessages(entry.messages);
        } else {
          setMood(null);
          setMessages([]);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }

  useEffect(() => {
    const cached = allEntries.find(e => e.date === selectedDate);
    if (cached) {
      setMood(cached.mood as MoodKey);
      setMessages(cached.messages as Message[]);
      setLoaded(true);
    } else {
      loadEntry(selectedDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, aiTyping]);

  function openPicker() {
    if (aiTyping) return;
    const [y, m] = selectedDate.split('-').map(Number);
    setPickerMonth(new Date(y, m - 1, 1));
    setShowDatePicker(true);
    const map: Record<string, string> = {};
    allEntries.forEach(e => { map[e.date] = e.mood; });
    setPickerEntries(map);
  }

  function handleDateChange(newDate: string) {
    if (draft.trim().length > 0) {
      if (!window.confirm(t.today.unsavedWarning)) return;
    }
    setSelectedDate(newDate);
    setMood(null);
    setMessages([]);
    setDraft('');
    setShowDatePicker(false);
    loadEntry(newDate);
  }

  async function send() {
    const text = draft.trim();
    if (!text || !mood) return;
    const time = new Date().toTimeString().slice(0, 5);
    const newMsg: Message = { from: 'me', text, time };
    const updatedMessages = [...messages, newMsg];

    setMessages(updatedMessages);
    setDraft('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; }
    setAiTyping(true);

    const tone = localStorage.getItem('beans_ai_tone') ?? 'friend';
    let reply = '';
    if (tone !== 'quiet') {
      try {
        const res = await fetch('/api/ai-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, mood, tone, language }),
        });
        const data = await res.json();
        reply = data.reply ?? '';
      } catch {}
    }

    setAiTyping(false);
    const finalMessages = tone === 'quiet'
      ? updatedMessages
      : [...updatedMessages, { from: 'ai' as const, text: reply || t.today.fallbackReply, time }];
    setMessages(finalMessages);

    fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate, mood, messages: finalMessages }),
    }).then(() => refresh()).catch(() => {});

    setPickerEntries(prev => ({ ...prev, [selectedDate]: mood! }));
  }

  const moodObj = mood ? MOOD_BY_KEY[mood] : null;
  const canSend = !!mood && draft.trim().length > 0;
  const isPastDate = selectedDate !== todayKey();

  // Calendar picker computed values
  const today = new Date();
  const pickerFirstDay = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth(), 1);
  const pickerDaysInMonth = new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 0).getDate();
  const pickerCells: (Date | null)[] = [];
  for (let i = 0; i < pickerFirstDay.getDay(); i++) pickerCells.push(null);
  for (let d = 1; d <= pickerDaysInMonth; d++) pickerCells.push(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth(), d));
  while (pickerCells.length % 7 !== 0) pickerCells.push(null);

  const isCurrentMonth = pickerMonth.getFullYear() === today.getFullYear() && pickerMonth.getMonth() === today.getMonth();
  const pickerMonthLabel = pickerMonth.toLocaleDateString(dateLocale, { month: 'long', year: 'numeric' });

  const navBtnStyle = {
    width: 30, height: 30, borderRadius: 15,
    background: theme.surfaceAlt,
    border: `1px solid ${theme.line}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', color: theme.ink, flexShrink: 0 as const,
  };

  return (
    <>
      {/* Header */}
      <div style={{ padding: '12px 20px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: isPastDate ? 10 : 14 }}>
          <div>
            <button
              onClick={openPicker}
              style={{
                background: theme.surfaceAlt,
                border: `1px solid ${theme.line}`,
                borderRadius: 20,
                cursor: aiTyping ? 'default' : 'pointer',
                padding: '4px 10px',
                display: 'inline-flex', alignItems: 'center', gap: 5,
                marginBottom: 6,
                opacity: aiTyping ? 0.5 : 1,
              }}
            >
              <span className="font-mono" style={{ fontSize: 11, color: theme.inkSoft, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {selectedDateLabel}
              </span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: theme.inkSoft }}>
                <path d="M2 3.5l3 3 3-3" />
              </svg>
            </button>
            <div className="font-display" style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6, color: theme.ink, lineHeight: 1.05 }}>
              {t.today.greetingPrefix(hour)}{t.today.greetingSep}<span style={{ fontStyle: 'italic' }}>{username}</span>
            </div>
          </div>
          <button
            onClick={() => router.push('/settings')}
            style={{
              width: 38, height: 38, borderRadius: 19,
              background: theme.surfaceAlt, color: theme.ink,
              border: 'none', cursor: 'pointer', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, fontSize: 14, fontFamily: 'inherit',
            }}
          >
            {avatarLetter}
          </button>
        </div>

        {/* Past-date banner */}
        {isPastDate && (
          <div style={{ marginBottom: 10, padding: '6px 12px', background: theme.surfaceAlt, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: 11, color: theme.inkFaint, letterSpacing: 0.5 }}>
              {t.today.pastDateBanner}
            </span>
            <button
              onClick={() => handleDateChange(todayKey())}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.accent, fontSize: 11, fontFamily: 'inherit', padding: 0 }}
            >
              {t.today.backToToday}
            </button>
          </div>
        )}

        <MoodStrip selected={mood} onSelect={setMood} theme={theme} />
      </div>

      {/* Chat scroll */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto',
        padding: '8px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {!loaded && (
          <>
            <SkeletonBubble align="right" width="62%" theme={theme} />
            <SkeletonBubble align="left"  width="72%" theme={theme} />
            <SkeletonBubble align="right" width="42%" theme={theme} />
          </>
        )}
        {loaded && messages.length === 0 && !mood && (
          <EmptyHint theme={theme} text={t.today.hintNone} />
        )}
        {loaded && messages.length === 0 && mood && (
          <EmptyHint theme={theme} text={t.today.hintMoodPicked(t.moods[moodObj!.key], moodObj!.emoji)} />
        )}
        {messages.map((m, i) => (
          <Bubble key={i} msg={m} theme={theme} themeName={themeName} />
        ))}
        {aiTyping && <TypingBubble theme={theme} />}
      </div>

      {/* Composer */}
      <div style={{
        flexShrink: 0, padding: '8px 12px 10px',
        borderTop: `1px solid ${theme.line}`,
        background: theme.bg,
        display: 'flex', gap: 8, alignItems: 'flex-end',
      }}>
        <div style={{
          flex: 1, background: theme.surface, borderRadius: 22,
          border: `1px solid ${theme.line}`,
          padding: '8px 12px', minHeight: 38,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={e => {
              setDraft(e.target.value);
              const el = e.target;
              el.style.height = 'auto';
              el.style.height = `${el.scrollHeight}px`;
            }}
            placeholder={mood ? t.today.placeholderMood : t.today.placeholderNoMood}
            rows={1}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            style={{
              flex: 1, border: 'none', outline: 'none', resize: 'none',
              background: 'transparent', color: theme.ink,
              fontFamily: 'inherit', fontSize: 15, lineHeight: 1.4,
              maxHeight: 100, overflowY: 'auto', padding: 0,
            }}
          />
          <button
            onClick={send}
            disabled={!canSend}
            style={{
              width: 30, height: 30, borderRadius: 15, flexShrink: 0,
              background: canSend ? theme.accent : theme.surfaceAlt,
              color: canSend ? '#fff' : theme.inkFaint,
              border: 'none', cursor: canSend ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 11V3M3 7l4-4 4 4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar date picker modal */}
      {showDatePicker && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setShowDatePicker(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 50 }}
          />
          {/* Centered card */}
          <div style={{
            position: 'fixed', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 51,
            background: theme.surface,
            borderRadius: 20,
            border: `1px solid ${theme.line}`,
            padding: '16px 16px 20px',
            width: 'min(92vw, 340px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          }}>
            {/* Month navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <button
                onClick={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() - 1, 1))}
                style={navBtnStyle}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2L4 6l4 4" /></svg>
              </button>
              <span className="font-display" style={{ fontSize: 15, fontWeight: 500, color: theme.ink, letterSpacing: -0.2 }}>
                {pickerMonthLabel}
              </span>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <button
                  onClick={() => setPickerMonth(new Date(pickerMonth.getFullYear(), pickerMonth.getMonth() + 1, 1))}
                  disabled={isCurrentMonth}
                  style={{ ...navBtnStyle, opacity: isCurrentMonth ? 0.3 : 1, cursor: isCurrentMonth ? 'default' : 'pointer' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 2l4 4-4 4" /></svg>
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  style={{ ...navBtnStyle }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 2l8 8M10 2l-8 8" /></svg>
                </button>
              </div>
            </div>

            {/* Weekday headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
              {t.calendar.weekdays.map((w, i) => (
                <div key={i} className="font-mono" style={{ textAlign: 'center', fontSize: 9, fontWeight: 600, color: theme.inkFaint, letterSpacing: 0.4, textTransform: 'uppercase' }}>
                  {w}
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
              {pickerCells.map((d, i) => {
                if (!d) return <div key={i} style={{ aspectRatio: '1' }} />;
                const k = dayKey(d);
                const entryMood = pickerEntries[k];
                const moodInfo = entryMood ? MOOD_BY_KEY[entryMood as MoodKey] : null;
                const isToday = k === todayKey();
                const isFuture = d > today;
                const isSelected = k === selectedDate;

                return (
                  <button
                    key={i}
                    onClick={() => { if (!isFuture) handleDateChange(k); }}
                    disabled={isFuture}
                    style={{
                      aspectRatio: '1',
                      borderRadius: 10,
                      background: isSelected
                        ? theme.accent
                        : moodInfo ? moodInfo.color + '22' : theme.surfaceAlt,
                      border: isSelected
                        ? 'none'
                        : isToday
                          ? `1.5px solid ${theme.accent}`
                          : `1px solid ${theme.line}`,
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      cursor: isFuture ? 'default' : 'pointer',
                      opacity: isFuture ? 0.25 : 1,
                      position: 'relative',
                      padding: 0,
                    }}
                  >
                    <span style={{
                      fontSize: 9, fontWeight: 600,
                      color: isSelected ? 'rgba(255,255,255,0.85)' : theme.inkFaint,
                      position: 'absolute', top: 3, left: 5,
                    }}>
                      {d.getDate()}
                    </span>
                    {moodInfo && (
                      <span style={{ fontSize: 15, lineHeight: 1, marginTop: 4 }}>
                        {moodInfo.emoji}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

function SkeletonBubble({ align, width, theme }: { align: 'left' | 'right'; width: string; theme: any }) {
  return (
    <div style={{ display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', marginTop: 4 }}>
      <div className="animate-shimmer" style={{
        width, height: 60, borderRadius: 20, flexShrink: 0,
        background: align === 'right'
          ? theme.surfaceAlt
          : `linear-gradient(90deg, ${theme.surfaceAlt} 25%, ${theme.surface} 50%, ${theme.surfaceAlt} 75%)`,
        backgroundSize: '200% 100%',
      }} />
    </div>
  );
}

function EmptyHint({ theme, text }: { theme: ReturnType<typeof useTheme>['theme']; text: string }) {
  return (
    <div style={{
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: theme.inkFaint, padding: 32, textAlign: 'center',
    }}>
      <div className="font-display" style={{ fontSize: 18, fontStyle: 'italic', color: theme.inkSoft, maxWidth: 240, lineHeight: 1.4 }}>
        {text}
      </div>
    </div>
  );
}
