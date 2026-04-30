// Archive (entry list w/ search) + Entry detail screens

function ScreenArchive({ theme, themeName, onOpenEntry }) {
  const t = theme;
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  const filtered = ENTRIES.filter(e => {
    if (filter !== 'all' && e.mood !== filter) return false;
    if (query) {
      const q = query.toLowerCase();
      return e.messages.some(m => m.text.toLowerCase().includes(q));
    }
    return true;
  });

  // Group by month
  const groups = {};
  filtered.forEach(e => {
    const key = e.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    (groups[key] = groups[key] || []).push(e);
  });

  return (
    <>
      <Header theme={themeName} title="Entries" subtitle={`${ENTRIES.length} memories saved`}/>

      <div style={{ padding: '0 20px 8px', flexShrink: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: t.surface, border: `1px solid ${t.line}`,
          borderRadius: 12, padding: '8px 12px',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={t.inkFaint} strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>
          </svg>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search your days…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              color: t.ink, fontFamily: 'inherit', fontSize: 14,
            }}/>
        </div>

        {/* Mood filter chips */}
        <div className="beans-scroll" style={{ display: 'flex', gap: 6, marginTop: 10, overflowX: 'auto' }}>
          {[{key:'all', label:'All', emoji:''}, ...MOODS].map(m => {
            const isSel = filter === m.key;
            return (
              <button key={m.key} className="beans-btn" onClick={() => setFilter(m.key)} style={{
                flexShrink: 0, padding: '6px 12px', borderRadius: 14,
                background: isSel ? t.ink : t.surface,
                color: isSel ? t.bg : t.inkSoft,
                border: `1px solid ${isSel ? t.ink : t.line}`,
                fontSize: 12, fontWeight: 500,
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {m.emoji && <span style={{ fontSize: 14 }}>{m.emoji}</span>}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="beans-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 20px 20px' }}>
        {Object.entries(groups).map(([month, entries]) => (
          <div key={month} style={{ marginBottom: 18 }}>
            <div className="beans-mono" style={{ fontSize: 10, fontWeight: 600, color: t.inkFaint, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, marginTop: 4 }}>{month}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {entries.map(e => <EntryCard key={dayKey(e.date)} entry={e} theme={t} themeName={themeName} onClick={() => onOpenEntry(dayKey(e.date))}/>)}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: t.inkFaint, fontSize: 14 }}>No entries match.</div>
        )}
      </div>
    </>
  );
}

function EntryCard({ entry, theme, themeName, onClick }) {
  const t = theme;
  const mood = MOOD_BY_KEY[entry.mood];
  const dayName = entry.date.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNum = entry.date.getDate();
  const firstMsg = entry.messages.find(m => m.from === 'me');
  return (
    <button className="beans-btn" onClick={onClick} style={{
      width: '100%', textAlign: 'left',
      background: t.surface, border: `1px solid ${t.line}`,
      borderRadius: 14, padding: 14,
      display: 'flex', gap: 12, alignItems: 'center',
    }}>
      <div style={{
        flexShrink: 0, width: 48, height: 48, borderRadius: 12,
        background: mood.color + '22',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div className="beans-mono" style={{ fontSize: 9, fontWeight: 700, color: mood.color, letterSpacing: 0.4, textTransform: 'uppercase' }}>{dayName}</div>
        <div className="beans-display" style={{ fontSize: 18, fontWeight: 500, color: t.ink, lineHeight: 1 }}>{dayNum}</div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: 14 }}>{mood.emoji}</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: mood.color, textTransform: 'uppercase', letterSpacing: 0.4 }}>{mood.label}</span>
          <span style={{ fontSize: 11, color: t.inkFaint, marginLeft: 'auto' }}>{firstMsg?.time}</span>
        </div>
        <div style={{
          fontSize: 13, color: t.inkSoft, lineHeight: 1.4,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>{firstMsg?.text}</div>
      </div>
    </button>
  );
}

function ScreenEntry({ entryKey, theme, themeName, onBack }) {
  const t = theme;
  const entry = ENTRIES_BY_DATE[entryKey];
  if (!entry) return <div style={{ padding: 20, color: t.inkFaint }}>Entry not found.</div>;
  const mood = MOOD_BY_KEY[entry.mood];
  const fullDate = entry.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <>
      <Header theme={themeName} title={fullDate.split(',')[0]} subtitle={fullDate.split(',').slice(1).join(',').trim()} onBack={onBack}
        right={
          <button className="beans-btn" style={{
            width: 36, height: 36, borderRadius: 18, color: t.inkSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="9" cy="3.5" r="1.2"/><circle cx="9" cy="9" r="1.2"/><circle cx="9" cy="14.5" r="1.2"/>
            </svg>
          </button>
        }/>

      <div style={{ padding: '0 20px 14px', flexShrink: 0 }}>
        <div style={{
          background: mood.color + '22', borderRadius: 16, padding: 16,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <span style={{ fontSize: 36, lineHeight: 1 }}>{mood.emoji}</span>
          <div>
            <div className="beans-mono" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: mood.color }}>Mood</div>
            <div className="beans-display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.3, color: t.ink }}>{mood.label}</div>
          </div>
        </div>
      </div>

      <div className="beans-scroll" style={{ flex: 1, overflowY: 'auto', padding: '4px 16px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {entry.messages.map((m, i) => <Bubble key={i} msg={m} theme={t} themeName={themeName}/>)}
      </div>
    </>
  );
}

Object.assign(window, { ScreenArchive, ScreenEntry });
