'use client';
import { MOODS, MoodKey } from '@/lib/moods';
import { Theme } from '@/lib/themes';
import { useTranslation } from '@/components/providers/LanguageProvider';

export default function MoodStrip({
  selected, onSelect, theme,
}: {
  selected: MoodKey | null;
  onSelect: (m: MoodKey) => void;
  theme: Theme;
}) {
  const { t } = useTranslation();
  return (
    <div style={{
      display: 'flex', gap: 6, justifyContent: 'space-between',
      background: theme.surface, borderRadius: 18,
      padding: '10px 8px',
      border: `1px solid ${theme.line}`,
    }}>
      {MOODS.map(m => {
        const isSel = selected === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onSelect(m.key)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '6px 4px', borderRadius: 14,
              border: 'none', background: isSel ? m.color + '22' : 'transparent',
              cursor: 'pointer', transition: 'all .18s',
            }}
          >
            <span style={{
              fontSize: 26, lineHeight: 1,
              transform: isSel ? 'scale(1.15)' : 'scale(1)', transition: 'transform .2s',
              display: 'block',
            }}>{m.emoji}</span>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 0.2,
              color: isSel ? m.color : theme.inkFaint, textTransform: 'uppercase',
            }}>{t.moods[m.key]}</span>
          </button>
        );
      })}
    </div>
  );
}
