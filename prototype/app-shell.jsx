// Shared shell: phone canvas, status bar, bottom nav, theme tokens.
// Three themes: cream (default), dusk (dark), notebook (paper-textured).

const THEMES = {
  cream: {
    bg: '#F7F2EA',
    surface: '#FFFFFF',
    surfaceAlt: '#F0E9DD',
    ink: '#2A241E',
    inkSoft: '#6B5F52',
    inkFaint: '#A89B8B',
    accent: '#D97757',
    accentSoft: '#F4D9C9',
    sage: '#7A9B6E',
    line: 'rgba(42,36,30,0.08)',
    bubbleMe: '#D97757',
    bubbleMeText: '#FFFFFF',
    bubbleAi: '#F0E9DD',
    bubbleAiText: '#2A241E',
    statusBarTint: '#2A241E',
  },
  dusk: {
    bg: '#1A1614',
    surface: '#241F1B',
    surfaceAlt: '#2E2823',
    ink: '#F2EBE0',
    inkSoft: '#A89B8B',
    inkFaint: '#6B5F52',
    accent: '#E89472',
    accentSoft: '#3D2A22',
    sage: '#9DB890',
    line: 'rgba(242,235,224,0.08)',
    bubbleMe: '#D97757',
    bubbleMeText: '#FFFFFF',
    bubbleAi: '#2E2823',
    bubbleAiText: '#F2EBE0',
    statusBarTint: '#F2EBE0',
  },
  notebook: {
    bg: '#FAF6EC',
    surface: '#FFFCF3',
    surfaceAlt: '#F0E9D6',
    ink: '#2D2A1F',
    inkSoft: '#6B6452',
    inkFaint: '#A89B82',
    accent: '#A8654A',
    accentSoft: '#E8D4C2',
    sage: '#6E8862',
    line: 'rgba(45,42,31,0.10)',
    bubbleMe: '#A8654A',
    bubbleMeText: '#FFFCF3',
    bubbleAi: '#F0E9D6',
    bubbleAiText: '#2D2A1F',
    statusBarTint: '#2D2A1F',
  },
};

// Inject fonts + base styles once
if (!document.getElementById('beans-fonts')) {
  const link = document.createElement('link');
  link.id = 'beans-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400;1,6..72,500&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap';
  document.head.appendChild(link);
}

if (!document.getElementById('beans-base')) {
  const s = document.createElement('style');
  s.id = 'beans-base';
  s.textContent = `
    .beans-app, .beans-app * { box-sizing: border-box; }
    .beans-app { font-family: 'Geist', -apple-system, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    .beans-display { font-family: 'Newsreader', Georgia, serif; font-optical-sizing: auto; }
    .beans-mono { font-family: 'Geist Mono', ui-monospace, monospace; }
    .beans-app::-webkit-scrollbar { display: none; }
    .beans-scroll { scrollbar-width: none; -ms-overflow-style: none; }
    .beans-scroll::-webkit-scrollbar { display: none; }
    .beans-btn { border: none; background: none; padding: 0; font: inherit; color: inherit; cursor: pointer; }
    .beans-notebook-bg {
      background-image: repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(168,101,74,0.10) 27px, rgba(168,101,74,0.10) 28px);
    }
    @keyframes beans-fadein { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }
    .beans-fadein { animation: beans-fadein .28s ease-out both; }
    @keyframes beans-pop { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
    .beans-pop { animation: beans-pop .32s cubic-bezier(.34,1.56,.64,1) both; }
  `;
  document.head.appendChild(s);
}

// Phone canvas — 390x844, no frame. Scales down via parent flex if needed.
function Phone({ children, theme = 'cream', label }) {
  const t = THEMES[theme];
  return (
    <div className="beans-app" data-screen-label={label} style={{
      width: 390, height: 844,
      background: t.bg, color: t.ink,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {children}
    </div>
  );
}

// iOS-ish status bar (just the time + dots, no full chrome)
function StatusBar({ theme = 'cream', time = '9:41' }) {
  const t = THEMES[theme];
  return (
    <div style={{
      height: 47, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 28px', paddingTop: 12,
      color: t.statusBarTint,
      fontSize: 15, fontWeight: 600, letterSpacing: -0.2,
    }}>
      <span style={{ fontFamily: 'SF Pro Display, system-ui' }}>{time}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx=".7"/>
          <rect x="4.5" y="5" width="3" height="6" rx=".7"/>
          <rect x="9" y="2.5" width="3" height="8.5" rx=".7"/>
          <rect x="13.5" y="0" width="3" height="11" rx=".7"/>
        </svg>
        {/* wifi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 1.5C4.6 1.5 2 2.6 0 4.4l1.5 1.5C3.1 4.4 5.2 3.5 7.5 3.5s4.4.9 6 2.4L15 4.4C13 2.6 10.4 1.5 7.5 1.5Z"/>
          <path d="M7.5 5.5c-1.7 0-3.3.6-4.5 1.7l1.5 1.5c.8-.7 1.9-1.2 3-1.2s2.2.5 3 1.2L12 7.2c-1.2-1.1-2.8-1.7-4.5-1.7Z"/>
          <circle cx="7.5" cy="9.5" r="1.5"/>
        </svg>
        {/* battery */}
        <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
          <rect x=".5" y=".5" width="22" height="11" rx="2.5" stroke="currentColor" opacity=".4"/>
          <rect x="2" y="2" width="19" height="8" rx="1.2" fill="currentColor"/>
          <rect x="23.5" y="4" width="1.5" height="4" rx=".5" fill="currentColor" opacity=".4"/>
        </svg>
      </div>
    </div>
  );
}

// Home indicator (iOS bottom bar)
function HomeIndicator({ theme = 'cream' }) {
  const t = THEMES[theme];
  return (
    <div style={{
      height: 30, flexShrink: 0, display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center', paddingBottom: 8,
    }}>
      <div style={{ width: 134, height: 5, borderRadius: 3, background: t.statusBarTint, opacity: .9 }}/>
    </div>
  );
}

// Bottom tab bar — 4 tabs
function TabBar({ active, onChange, theme = 'cream' }) {
  const t = THEMES[theme];
  const tabs = [
    { id: 'today',    label: 'Today',    icon: 'pen' },
    { id: 'calendar', label: 'Calendar', icon: 'cal' },
    { id: 'archive',  label: 'Entries',  icon: 'list' },
    { id: 'insights', label: 'Insights', icon: 'spark' },
    { id: 'settings', label: 'Profile',  icon: 'user' },
  ];
  return (
    <div style={{
      flexShrink: 0,
      borderTop: `1px solid ${t.line}`,
      background: t.bg,
      paddingTop: 10, paddingBottom: 4,
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(tab => {
        const isActive = active === tab.id;
        return (
          <button key={tab.id} className="beans-btn" onClick={() => onChange(tab.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: isActive ? t.accent : t.inkFaint,
            padding: '4px 8px', minWidth: 56,
            transition: 'color .15s',
          }}>
            <TabIcon name={tab.icon} active={isActive}/>
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.1 }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function TabIcon({ name, active }) {
  const sw = active ? 2.2 : 1.8;
  const fill = active ? 'currentColor' : 'none';
  if (name === 'pen') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? .15 : 0}/>
    </svg>
  );
  if (name === 'cal') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? .12 : 0}/>
      <path d="M3 9h18M8 3v4M16 3v4"/>
    </svg>
  );
  if (name === 'list') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 6h14M5 12h14M5 18h9"/>
    </svg>
  );
  if (name === 'spark') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19V9M10 19V5M16 19v-7M22 19v-4" />
    </svg>
  );
  if (name === 'user') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" fill={active ? 'currentColor' : 'none'} fillOpacity={active ? .12 : 0}/>
      <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>
    </svg>
  );
  return null;
}

// Header (back button + title)
function Header({ title, onBack, right, theme = 'cream', subtitle }) {
  const t = THEMES[theme];
  return (
    <div style={{
      flexShrink: 0,
      padding: '8px 20px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {onBack && (
        <button className="beans-btn" onClick={onBack} style={{
          width: 36, height: 36, borderRadius: 18, marginLeft: -8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: t.ink,
        }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4L6 10l6 6"/>
          </svg>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="beans-display" style={{
          fontSize: 26, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.1,
          color: t.ink,
        }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: t.inkSoft, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

Object.assign(window, { THEMES, Phone, StatusBar, HomeIndicator, TabBar, Header });
