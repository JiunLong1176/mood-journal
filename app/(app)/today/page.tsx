'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useUser } from '@/components/providers/UserProvider';
import MoodStrip from '@/components/ui/MoodStrip';
import { Bubble, TypingBubble, type Message } from '@/components/ui/Bubble';
import { MoodKey, MOOD_BY_KEY } from '@/lib/moods';
import { useTranslation } from '@/components/providers/LanguageProvider';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TodayPage() {
  const { theme, themeName } = useTheme();
  const { username, avatarLetter } = useUser();
  const { t, language } = useTranslation();
  const router = useRouter();
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [aiTyping, setAiTyping] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const today = new Date();
  const dateLocale = language === 'zh' ? 'zh-CN' : 'en-US';
  const todayLabel = today.toLocaleDateString(dateLocale, { weekday: 'long', month: 'long', day: 'numeric' });
  const hour = today.getHours();

  // Load today's existing entry from Supabase
  useEffect(() => {
    fetch(`/api/entries?date=${todayKey()}`)
      .then(r => r.json())
      .then(entry => {
        if (entry) {
          setMood(entry.mood as MoodKey);
          setMessages(entry.messages);
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, aiTyping]);

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

    // Get AI reply (skip if quiet mode)
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

    // Save to Supabase
    fetch('/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: todayKey(), mood, messages: finalMessages }),
    }).catch(() => {});
  }

  const moodObj = mood ? MOOD_BY_KEY[mood] : null;
  const canSend = !!mood && draft.trim().length > 0;

  return (
    <>
      {/* Header */}
      <div style={{ padding: '12px 20px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <div>
            <div className="font-mono" style={{ fontSize: 11, color: theme.inkFaint, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
              {todayLabel}
            </div>
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
            <SkeletonBubble align="right" width="62%" inkFaint={theme.inkFaint} />
            <SkeletonBubble align="left"  width="72%" inkFaint={theme.inkFaint} />
            <SkeletonBubble align="right" width="42%" inkFaint={theme.inkFaint} />
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
    </>
  );
}

function SkeletonBubble({ align, width, inkFaint }: { align: 'left' | 'right'; width: string; inkFaint: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: align === 'right' ? 'flex-end' : 'flex-start', marginTop: 4 }}>
      <div className="animate-shimmer" style={{
        width, height: 40, borderRadius: 20,
        background: inkFaint, opacity: 0.35,
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
