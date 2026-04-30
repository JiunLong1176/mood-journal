// Main app — wires up screens, navigation, theme switching, tweaks panel.

function BeansApp({ themeName: forcedTheme, label }) {
  const [tab, setTab] = React.useState('today');
  const [openEntry, setOpenEntry] = React.useState(null);
  const [themeName, setThemeName] = React.useState(forcedTheme || 'cream');
  React.useEffect(() => { if (forcedTheme) setThemeName(forcedTheme); }, [forcedTheme]);
  const theme = THEMES[themeName];

  const goEntry = (k) => setOpenEntry(k);
  const closeEntry = () => setOpenEntry(null);

  let content;
  if (openEntry) {
    content = <ScreenEntry entryKey={openEntry} theme={theme} themeName={themeName} onBack={closeEntry}/>;
  } else if (tab === 'today') {
    content = <ScreenToday theme={theme} themeName={themeName} onOpenEntry={goEntry} onNavigate={setTab}/>;
  } else if (tab === 'calendar') {
    content = <ScreenCalendar theme={theme} themeName={themeName} onOpenEntry={goEntry}/>;
  } else if (tab === 'archive') {
    content = <ScreenArchive theme={theme} themeName={themeName} onOpenEntry={goEntry}/>;
  } else if (tab === 'insights') {
    content = <ScreenInsights theme={theme} themeName={themeName}/>;
  } else if (tab === 'settings') {
    content = <ScreenSettings theme={theme} themeName={themeName} onThemeChange={setThemeName}/>;
  }

  // Notebook bg overlay
  const isNotebook = themeName === 'notebook';

  return (
    <Phone theme={themeName} label={label}>
      <StatusBar theme={themeName}/>
      <div className={isNotebook ? 'beans-notebook-bg' : ''} style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {content}
      </div>
      {!openEntry && <TabBar active={tab} onChange={(id) => { setOpenEntry(null); setTab(id); }} theme={themeName}/>}
      <HomeIndicator theme={themeName}/>
    </Phone>
  );
}

Object.assign(window, { BeansApp });
