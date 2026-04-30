// Insights + Settings/profile screens

function ScreenInsights({ theme, themeName }) {
  const t = theme;

  // Compute stats from last 30 days
  const last30 = ENTRIES.filter(e => (TODAY - e.date) / (1000*60*60*24) < 30);
  const moodCount = {};
  last30.forEach(e => { moodCount[e.mood] = (moodCount[e.mood] || 0) + 1; });
  const total = last30.length;
  const sortedMoods = MOODS.slice().sort((a,b) => (moodCount[b.key]||0) - (moodCount[a.key]||0));
  const topMood = sortedMoods[0];

  // Streak: consecutive days from today backwards
  let streak = 0;
  for (let i = 0; i < 60; i++) {
    const d = new Date(TODAY); d.setDate(d.getDate() - i);
    if (ENTRIES_BY_DATE[dayKey(d)]) streak++; else break;
  }

  // Word frequency for cloud
  const stop = new Set('the a an and but or so to of for on in at with from is was were be been are i my me you we it that this just like really very still feel felt have had has just got get all about up down out off as if not no'.split(' '));
  const freq = {};
  last30.forEach(e => e.messages.filter(m => m.from === 'me').forEach(m => {
    m.text.toLowerCase().replace(/[^\w\s']/g, ' ').split(/\s+/).forEach(w => {
      if (w.length < 4 || stop.has(w)) return;
      freq[w] = (freq[w] || 0) + 1;
    });
  }));
  const words = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 14);
  const maxF = words[0]?.[1] || 1;

  // Day-of-week mood avg (rough: avg mood index, lower = happier)
  const moodScore = { rad: 5, good: 4, meh: 3, down: 2, awful: 1 };
  const dows = [0,0,0,0,0,0,0]; const dowsCount = [0,0,0,0,0,0,0];
  last30.forEach(e => { const d = e.date.getDay(); dows[d] += moodScore[e.mood]; dowsCount[d]++; });
  const dowAvg = dows.map((s, i) => dowsCount[i] ? s/dowsCount[i] : 0);
  const dowMax = Math.max(...dowAvg, 1);

  return (
    <>
      <Header theme={themeName} title="Insights" subtitle="Last 30 days"/>

      <div className="beans-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Hero stat */}
        <div style={{
          background: t.accent, color: '#fff', borderRadius: 20, padding: 20,
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>{topMood.emoji}</div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', opacity: .8 }}>Mostly</div>
            <div className="beans-display" style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.6, lineHeight: 1.05 }}>{topMood.label} days</div>
            <div style={{ fontSize: 13, opacity: .85, marginTop: 2 }}>{moodCount[topMood.key]} of your last {total} entries</div>
          </div>
        </div>

        {/* Streak + entries count row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <StatCard theme={t} label="Current streak" value={streak} unit={streak === 1 ? 'day' : 'days'} icon="🔥"/>
          <StatCard theme={t} label="Total entries" value={ENTRIES.length} unit="memories" icon="📝"/>
        </div>

        {/* Mood breakdown */}
        <Card theme={t} title="Mood breakdown">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {MOODS.map(m => {
              const c = moodCount[m.key] || 0;
              const pct = total ? (c / total) * 100 : 0;
              return (
                <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18, width: 22 }}>{m.emoji}</span>
                  <div style={{ flex: 1, height: 8, background: t.surfaceAlt, borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: pct + '%', height: '100%', background: m.color, transition: 'width .4s' }}/>
                  </div>
                  <span className="beans-mono" style={{ fontSize: 11, color: t.inkSoft, minWidth: 28, textAlign: 'right' }}>{c}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* By day of week */}
        <Card theme={t} title="By day of week" subtitle="How happy you tend to feel">
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginTop: 4 }}>
            {['S','M','T','W','T','F','S'].map((w, i) => {
              const v = dowAvg[i];
              const h = (v / dowMax) * 84;
              const hue = v >= 4 ? t.sage : v >= 3 ? t.accent : t.inkFaint;
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', height: h, background: hue, borderRadius: 6, opacity: v ? 1 : .15, transition: 'height .4s' }}/>
                  </div>
                  <span className="beans-mono" style={{ fontSize: 10, color: t.inkFaint, fontWeight: 600 }}>{w}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Word cloud */}
        <Card theme={t} title="What you wrote about">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 10px', alignItems: 'baseline', paddingTop: 4 }}>
            {words.map(([w, c]) => {
              const ratio = c / maxF;
              const size = 12 + ratio * 16;
              const op = 0.5 + ratio * 0.5;
              return (
                <span key={w} className="beans-display" style={{
                  fontSize: size, color: t.ink, opacity: op,
                  fontWeight: ratio > 0.6 ? 500 : 400,
                  fontStyle: ratio > 0.4 ? 'italic' : 'normal',
                  letterSpacing: -0.3,
                }}>{w}</span>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}

function StatCard({ theme, label, value, unit, icon }) {
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.line}`,
      borderRadius: 16, padding: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span className="beans-mono" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.6, textTransform: 'uppercase', color: theme.inkFaint }}>{label}</span>
        <span style={{ fontSize: 16 }}>{icon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className="beans-display" style={{ fontSize: 30, fontWeight: 500, letterSpacing: -0.8, color: theme.ink, lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: 12, color: theme.inkSoft }}>{unit}</span>
      </div>
    </div>
  );
}

function Card({ theme, title, subtitle, children }) {
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.line}`, borderRadius: 16, padding: 16 }}>
      <div style={{ marginBottom: 12 }}>
        <div className="beans-display" style={{ fontSize: 16, fontWeight: 500, letterSpacing: -0.2, color: theme.ink }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: theme.inkFaint, marginTop: 1 }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function ScreenSettings({ theme, themeName, onThemeChange }) {
  const t = theme;
  const [reminderTime, setReminderTime] = React.useState('21:00');
  const [reminderOn, setReminderOn] = React.useState(true);
  const [aiTone, setAiTone] = React.useState('friend');

  return (
    <>
      <Header theme={themeName} title="Profile"/>

      <div className="beans-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Profile head */}
        <div style={{
          background: t.surface, border: `1px solid ${t.line}`, borderRadius: 18,
          padding: 18, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 28, background: t.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 22, fontWeight: 600,
          }}>S</div>
          <div style={{ flex: 1 }}>
            <div className="beans-display" style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.3, color: t.ink }}>Sam Rivers</div>
            <div style={{ fontSize: 12, color: t.inkSoft, marginTop: 2 }}>Journaling since Feb 2026 · {ENTRIES.length} entries</div>
          </div>
        </div>

        {/* Streak callout */}
        <div style={{
          background: t.accentSoft, borderRadius: 16, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 28 }}>🔥</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.ink }}>You're on a 7-day streak</div>
            <div style={{ fontSize: 12, color: t.inkSoft, marginTop: 1 }}>Show up tomorrow to keep it going.</div>
          </div>
        </div>

        {/* Reminders */}
        <Card theme={t} title="Daily reminder">
          <Row theme={t} label="Remind me to write" right={<Toggle on={reminderOn} onChange={setReminderOn} theme={t}/>}/>
          {reminderOn && (
            <Row theme={t} label="Time" right={
              <input type="time" value={reminderTime} onChange={e => setReminderTime(e.target.value)} style={{
                background: 'transparent', border: 'none', color: t.ink,
                fontFamily: 'inherit', fontSize: 14, textAlign: 'right',
              }}/>
            }/>
          )}
        </Card>

        {/* AI tone */}
        <Card theme={t} title="AI replies" subtitle="How should your journal respond?">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              { key:'friend', label:'Like a friend', desc:'Warm, validating, brief' },
              { key:'reflective', label:'Reflective', desc:'Mirrors back themes' },
              { key:'quiet', label:'Quiet mode', desc:'No replies — just write' },
            ].map(opt => {
              const sel = aiTone === opt.key;
              return (
                <button key={opt.key} className="beans-btn" onClick={() => setAiTone(opt.key)} style={{
                  textAlign: 'left', padding: '10px 12px', borderRadius: 10,
                  background: sel ? t.accentSoft : 'transparent',
                  border: `1px solid ${sel ? t.accent : t.line}`,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    border: `2px solid ${sel ? t.accent : t.inkFaint}`,
                    background: sel ? t.accent : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {sel && <div style={{ width: 6, height: 6, borderRadius: 3, background: '#fff' }}/>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: t.ink }}>{opt.label}</div>
                    <div style={{ fontSize: 12, color: t.inkSoft, marginTop: 1 }}>{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Misc */}
        <Card theme={t} title="More">
          <Row theme={t} label="Export entries" right={<ChevronR theme={t}/>}/>
          <Row theme={t} label="Privacy & lock" right={<ChevronR theme={t}/>}/>
          <Row theme={t} label="Help & feedback" right={<ChevronR theme={t}/>} last/>
        </Card>
      </div>
    </>
  );
}

function Row({ theme, label, right, last }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: last ? 'none' : `1px solid ${theme.line}`,
    }}>
      <span style={{ fontSize: 14, color: theme.ink }}>{label}</span>
      {right}
    </div>
  );
}

function Toggle({ on, onChange, theme }) {
  return (
    <button className="beans-btn" onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 13,
      background: on ? theme.accent : theme.surfaceAlt,
      position: 'relative', transition: 'background .2s',
      border: `1px solid ${theme.line}`,
    }}>
      <div style={{
        width: 20, height: 20, borderRadius: 10, background: '#fff',
        position: 'absolute', top: 2, left: on ? 21 : 2,
        transition: 'left .2s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      }}/>
    </button>
  );
}

function ChevronR({ theme }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={theme.inkFaint} strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 3l4 4-4 4"/>
    </svg>
  );
}

Object.assign(window, { ScreenInsights, ScreenSettings });
