// Today screen — mood picker on top, chat-style input below.
// Opens directly into write mode. Selected mood emoji + AI replies as iMessage.

function ScreenToday({ theme, themeName, onOpenEntry, onNavigate }) {
  const t = theme;
  const [mood, setMood] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [aiTyping, setAiTyping] = React.useState(false);
  const scrollRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const [showMoodSheet, setShowMoodSheet] = React.useState(false);

  // Today display
  const todayLabel = TODAY.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = (() => {
    const h = 9; // pinned; "9:41" status bar
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    if (!mood) { setShowMoodSheet(true); return; }
    const time = new Date().toTimeString().slice(0,5);
    setMessages(m => [...m, { from:'me', text, time }]);
    setDraft('');
    setAiTyping(true);
    setTimeout(() => {
      setMessages(m => [...m, { from:'ai', text: aiReply(text, mood), time }]);
      setAiTyping(false);
    }, 1100);
  };

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, aiTyping]);

  const moodObj = mood ? MOOD_BY_KEY[mood] : null;

  return (
    <>
      {/* Top: greeting + mood pill */}
      <div style={{ padding: '4px 20px 12px', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
          <div>
            <div className="beans-mono" style={{ fontSize: 11, color: t.inkFaint, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 4 }}>
              {todayLabel}
            </div>
            <div className="beans-display" style={{ fontSize: 28, fontWeight: 500, letterSpacing: -0.6, color: t.ink, lineHeight: 1.05 }}>
              {greeting}, <span style={{ fontStyle: 'italic' }}>Sam</span>
            </div>
          </div>
          <button className="beans-btn" onClick={() => onNavigate('settings')} style={{
            width: 38, height: 38, borderRadius: 19,
            background: t.surfaceAlt, color: t.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 600, fontSize: 14,
          }}>S</button>
        </div>

        {/* Mood selector strip */}
        <MoodStrip moods={MOODS} selected={mood} onSelect={setMood} theme={t}/>
      </div>

      {/* Chat scroll area */}
      <div ref={scrollRef} className="beans-scroll" style={{
        flex: 1, overflowY: 'auto',
        padding: '8px 16px 12px',
        display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        {messages.length === 0 && !mood && (
          <EmptyHint theme={t} text="Pick how you're feeling, then tell me about your day." icon="up"/>
        )}
        {messages.length === 0 && mood && (
          <EmptyHint theme={t} text={`You're feeling ${moodObj.label.toLowerCase()} ${moodObj.emoji}. Tell me about it.`} icon="down"/>
        )}
        {messages.map((m, i) => <Bubble key={i} msg={m} theme={t} themeName={themeName}/>)}
        {aiTyping && <TypingBubble theme={t} themeName={themeName}/>}
      </div>

      {/* Composer */}
      <Composer
        theme={t} value={draft} onChange={setDraft} onSend={send}
        placeholder={mood ? "What's on your mind?" : 'Pick a mood first…'}
        canSend={!!mood && draft.trim().length > 0}
        ref={inputRef}
      />

      {/* Mood sheet (shown if user tries to send without mood) */}
      {showMoodSheet && (
        <MoodSheet theme={t} onClose={() => setShowMoodSheet(false)} onPick={(m) => { setMood(m); setShowMoodSheet(false); }}/>
      )}
    </>
  );
}

function MoodStrip({ moods, selected, onSelect, theme }) {
  const t = theme;
  return (
    <div style={{
      display: 'flex', gap: 6, justifyContent: 'space-between',
      background: t.surface, borderRadius: 18,
      padding: '10px 8px',
      border: `1px solid ${t.line}`,
    }}>
      {moods.map(m => {
        const isSel = selected === m.key;
        return (
          <button key={m.key} className="beans-btn" onClick={() => onSelect(m.key)} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 4px', borderRadius: 14,
            background: isSel ? m.color + '22' : 'transparent',
            transition: 'all .18s',
            transform: isSel ? 'scale(1)' : 'scale(1)',
          }}>
            <span style={{ fontSize: 26, lineHeight: 1, transform: isSel ? 'scale(1.15)' : 'scale(1)', transition: 'transform .2s' }}>{m.emoji}</span>
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2, color: isSel ? m.color : t.inkFaint, textTransform: 'uppercase' }}>{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function Bubble({ msg, theme, themeName }) {
  const t = theme;
  const isMe = msg.from === 'me';
  const isNotebook = themeName === 'notebook';
  return (
    <div className="beans-fadein" style={{
      display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginTop: 2,
    }}>
      <div style={{
        maxWidth: '78%',
        background: isMe ? t.bubbleMe : t.bubbleAi,
        color: isMe ? t.bubbleMeText : t.bubbleAiText,
        padding: '10px 14px',
        borderRadius: 20,
        borderBottomRightRadius: isMe ? 6 : 20,
        borderBottomLeftRadius: isMe ? 20 : 6,
        fontSize: 15, lineHeight: 1.4,
        fontFamily: isNotebook && !isMe ? '"Newsreader", Georgia, serif' : undefined,
        boxShadow: isMe ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      }}>
        {msg.text}
      </div>
    </div>
  );
}

function TypingBubble({ theme, themeName }) {
  const t = theme;
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{
        background: t.bubbleAi, padding: '12px 16px',
        borderRadius: 20, borderBottomLeftRadius: 6,
        display: 'flex', gap: 4,
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: 3, background: t.inkFaint,
            animation: `beans-dot 1.2s ${i*0.15}s infinite ease-in-out`,
          }}/>
        ))}
        <style>{`@keyframes beans-dot { 0%,60%,100%{opacity:.3;transform:translateY(0)} 30%{opacity:1;transform:translateY(-3px)} }`}</style>
      </div>
    </div>
  );
}

function EmptyHint({ theme, text, icon }) {
  const t = theme;
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      color: t.inkFaint, padding: 32, textAlign: 'center', gap: 14,
    }}>
      {icon === 'up' && (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M16 26V8M10 14l6-6 6 6"/>
        </svg>
      )}
      {icon === 'down' && (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M16 6v18M10 18l6 6 6-6"/>
        </svg>
      )}
      <div className="beans-display" style={{ fontSize: 18, fontStyle: 'italic', color: theme.inkSoft, maxWidth: 240, lineHeight: 1.4 }}>{text}</div>
    </div>
  );
}

const Composer = React.forwardRef(function Composer({ theme, value, onChange, onSend, placeholder, canSend }, ref) {
  const t = theme;
  return (
    <div style={{
      flexShrink: 0, padding: '8px 12px 10px',
      borderTop: `1px solid ${t.line}`,
      background: t.bg,
      display: 'flex', gap: 8, alignItems: 'flex-end',
    }}>
      <button className="beans-btn" style={{
        width: 36, height: 36, borderRadius: 18,
        background: t.surfaceAlt, color: t.inkSoft,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M9 4v10M4 9h10"/>
        </svg>
      </button>
      <div style={{
        flex: 1, background: t.surface, borderRadius: 22,
        border: `1px solid ${t.line}`,
        padding: '8px 12px', minHeight: 38,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <textarea ref={ref}
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={1}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); onSend(); }}}
          style={{
            flex: 1, border: 'none', outline: 'none', resize: 'none',
            background: 'transparent', color: t.ink,
            fontFamily: 'inherit', fontSize: 15, lineHeight: 1.4,
            maxHeight: 100, padding: 0,
          }}/>
        <button className="beans-btn" onClick={onSend} disabled={!canSend} style={{
          width: 30, height: 30, borderRadius: 15, flexShrink: 0,
          background: canSend ? t.accent : t.surfaceAlt,
          color: canSend ? '#fff' : t.inkFaint,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background .15s',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 11V3M3 7l4-4 4 4"/>
          </svg>
        </button>
      </div>
    </div>
  );
});

function MoodSheet({ theme, onClose, onPick }) {
  const t = theme;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'flex-end', zIndex: 50,
      animation: 'beans-fadein .2s',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: t.bg,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '24px 20px 28px',
      }}>
        <div style={{ width: 36, height: 4, background: t.line, borderRadius: 2, margin: '0 auto 18px' }}/>
        <div className="beans-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4, marginBottom: 4 }}>How's today?</div>
        <div style={{ fontSize: 14, color: t.inkSoft, marginBottom: 22 }}>Pick a mood to start writing.</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          {MOODS.map(m => (
            <button key={m.key} className="beans-btn" onClick={() => onPick(m.key)} style={{
              flex: 1, padding: '14px 0', borderRadius: 16,
              background: t.surface, border: `1px solid ${t.line}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              <span style={{ fontSize: 30 }}>{m.emoji}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: t.inkSoft }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenToday });
