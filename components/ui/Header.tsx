import { Theme } from '@/lib/themes';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  theme: Theme;
}

export default function Header({ title, subtitle, right, theme }: HeaderProps) {
  return (
    <div style={{
      flexShrink: 0,
      padding: '8px 20px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="font-display" style={{
          fontSize: 26, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.1,
          color: theme.ink,
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: theme.inkSoft, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
