'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Theme } from '@/lib/themes';
import { useTranslation } from '@/components/providers/LanguageProvider';

const TABS = [
  { id: 'today',    key: 'today'    as const, href: '/today',    icon: 'pen'   },
  { id: 'calendar', key: 'calendar' as const, href: '/calendar', icon: 'cal'   },
  { id: 'archive',  key: 'entries'  as const, href: '/archive',  icon: 'list'  },
  { id: 'insights', key: 'insights' as const, href: '/insights', icon: 'spark' },
  { id: 'settings', key: 'profile'  as const, href: '/settings', icon: 'user'  },
];

export default function TabBar({ theme }: { theme: Theme }) {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div style={{
      flexShrink: 0,
      borderTop: `1px solid ${theme.line}`,
      background: theme.bg,
      paddingTop: 10, paddingBottom: 4,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {TABS.map(tab => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link key={tab.id} href={tab.href} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? theme.accent : theme.inkFaint,
            padding: '4px 8px', minWidth: 56, textDecoration: 'none',
            transition: 'color .15s',
          }}>
            <TabIcon name={tab.icon} active={isActive} />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.1 }}>{t.tabs[tab.key]}</span>
          </Link>
        );
      })}
    </div>
  );
}

function TabIcon({ name, active }: { name: string; active: boolean }) {
  const sw = active ? 2.2 : 1.8;
  if (name === 'pen') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? .15 : 0} />
    </svg>
  );
  if (name === 'cal') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? .12 : 0} />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </svg>
  );
  if (name === 'list') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6h14M5 12h14M5 18h9" />
    </svg>
  );
  if (name === 'spark') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19v-4" />
    </svg>
  );
  if (name === 'user') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? .12 : 0} />
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
    </svg>
  );
  return null;
}
