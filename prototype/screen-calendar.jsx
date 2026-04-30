// Calendar screen — month grid with mood emojis on each day. Tap a day to open entry detail.

function ScreenCalendar({ theme, themeName, onOpenEntry, onNavigate }) {
  const t = theme;
  const [viewMonth, setViewMonth] = React.useState(() => new Date(TODAY.getFullYear(), TODAY.getMonth(), 1));

  const monthLabel = viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const firstDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const lastDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
  const startWeekday = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  // Build cells: leading blanks + days
  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);

  const monthEntries = ENTRIES.filter(e =>
    e.date.getMonth() === viewMonth.getMonth() && e.date.getFullYear() === viewMonth.getFullYear()
  );
  const moodCount = {};
  monthEntries.forEach(e => { moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
  const totalLogged = monthEntries.length;

  const prevMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonth = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  return (
    <>
      <Header theme={themeName} title="Mood calendar" subtitle={`${totalLogged} days logged this month`}/>

      {/* Month nav */}
      <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <button className="beans-btn" onClick={prevMonth} style={{
          width: 32, height: 32, borderRadius: 16, background: t.surface,
          border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.ink,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 3L5 7l4 4"/></svg>
        </button>
        <div className="beans-display" style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, color: t.ink }}>{monthLabel}</div>
        <button className="beans-btn" onClick={nextMonth} style={{
          width: 32, height: 32, borderRadius: 16, background: t.surface,
          border: `1px solid ${t.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.ink,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 3l4 4-4 4"/></svg>
        </button>
      </div>

      <div className="beans-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 16px 20px' }}>
        {/* Weekday header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6, padding: '0 4px' }}>
          {['S','M','T','W','T','F','S'].map((w, i) => (
            <div key={i} className="beans-mono" style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: t.inkFaint, letterSpacing: 0.6 }}>{w}</div>
          ))}
        </div>

        {/* Day grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ aspectRatio: '1' }}/>;
            const k = dayKey(d);
            const entry = ENTRIES_BY_DATE[k];
            const mood = entry ? MOOD_BY_KEY[entry.mood] : null;
            const isToday = k === dayKey(TODAY);
            const isFuture = d > TODAY;
            return (
              <button key={i} className="beans-btn" onClick={() => entry && onOpenEntry(k)} disabled={!entry} style={{
                aspectRatio: '1', borderRadius: 12,
                background: mood ? mood.color + '22' : t.surface,
                border: isToday ? `1.5px solid ${t.accent}` : `1px solid ${t.line}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                opacity: isFuture ? 0.35 : 1,
                cursor: entry ? 'pointer' : 'default',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', top: 4, left: 6, fontSize: 9, fontWeight: 600, color: t.inkFaint }}>{d.getDate()}</div>
                {mood ? (
                  <span style={{ fontSize: 22, lineHeight: 1, marginTop: 4 }}>{mood.emoji}</span>
                ) : (
                  !isFuture && <span style={{ width: 4, height: 4, borderRadius: 2, background: t.inkFaint, opacity: .3, marginTop: 6 }}/>
                )}
              </button>
            );
          })}
        </div>

        {/* Mood breakdown */}
        <div style={{ marginTop: 24, background: t.surface, borderRadius: 16, padding: 16, border: `1px solid ${t.line}` }}>
          <div className="beans-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: t.inkFaint, marginBottom: 12 }}>This month</div>
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 14, background: t.surfaceAlt }}>
            {MOODS.map(m => {
              const pct = totalLogged ? (moodCount[m.key] || 0) / totalLogged * 100 : 0;
              return pct > 0 ? <div key={m.key} style={{ width: pct + '%', background: m.color }}/> : null;
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px' }}>
            {MOODS.map(m => (
              <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: t.inkSoft }}>
                <span style={{ fontSize: 14 }}>{m.emoji}</span>
                <span style={{ color: t.ink, fontWeight: 600 }}>{moodCount[m.key] || 0}</span>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { ScreenCalendar });
