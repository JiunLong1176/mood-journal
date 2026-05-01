'use client';
import { useTheme } from './providers/ThemeProvider';
import TabBar from './ui/TabBar';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { theme, themeName } = useTheme();

  return (
    // Full-screen on mobile; centered card on desktop
    <div style={{
      height: '100dvh',
      overflow: 'hidden',
      background: '#E5DDD4',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 480,
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: theme.bg,
        color: theme.ink,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        // Card shadow only on desktop
        boxShadow: '0 0 60px rgba(0,0,0,0.12)',
      }}
        className={themeName === 'notebook' ? 'notebook-bg' : ''}
      >
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          {children}
        </main>
        <TabBar theme={theme} />
      </div>
    </div>
  );
}
