import { Theme, ThemeName } from '@/lib/themes';

export interface Message {
  from: 'me' | 'ai';
  text: string;
  time: string;
}

export function Bubble({ msg, theme, themeName }: { msg: Message; theme: Theme; themeName: ThemeName }) {
  const isMe = msg.from === 'me';
  const isNotebook = themeName === 'notebook';
  return (
    <div className="animate-fadein" style={{
      display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start',
      marginTop: 2,
    }}>
      <div style={{
        maxWidth: '78%',
        background: isMe ? theme.bubbleMe : theme.bubbleAi,
        color: isMe ? theme.bubbleMeText : theme.bubbleAiText,
        padding: '10px 14px',
        borderRadius: 20,
        borderBottomRightRadius: isMe ? 6 : 20,
        borderBottomLeftRadius: isMe ? 20 : 6,
        fontSize: 15, lineHeight: 1.4,
        fontFamily: isNotebook && !isMe ? 'var(--font-display)' : undefined,
        boxShadow: isMe ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
      }}>
        {msg.text}
        <div style={{ fontSize: 11, opacity: 0.5, marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

export function TypingBubble({ theme }: { theme: Theme }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{
        background: theme.bubbleAi, padding: '12px 16px',
        borderRadius: 20, borderBottomLeftRadius: 6,
        display: 'flex', gap: 4,
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: 3, background: theme.inkFaint,
            display: 'inline-block',
            animation: `dot 1.2s ${i * 0.15}s infinite ease-in-out`,
          }} />
        ))}
      </div>
    </div>
  );
}
