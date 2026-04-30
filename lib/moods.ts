export type MoodKey = 'rad' | 'good' | 'meh' | 'down' | 'awful';

export interface Mood {
  key: MoodKey;
  emoji: string;
  label: string;
  color: string;
}

export const MOODS: Mood[] = [
  { key: 'rad',   emoji: '😄', label: 'Rad',   color: '#E8B04A' },
  { key: 'good',  emoji: '🙂', label: 'Good',  color: '#7A9B6E' },
  { key: 'meh',   emoji: '😐', label: 'Meh',   color: '#B8A99A' },
  { key: 'down',  emoji: '🙁', label: 'Down',  color: '#6B8AB8' },
  { key: 'awful', emoji: '😣', label: 'Awful', color: '#C16A6A' },
];

export const MOOD_BY_KEY = Object.fromEntries(MOODS.map(m => [m.key, m])) as Record<MoodKey, Mood>;

// Rule-based fallback — ported from prototype app-data.jsx
export function ruleBasedReply(text: string, moodKey: MoodKey): string {
  const t = text.toLowerCase();
  if (/promot|raise|got the job|landed|launched|shipped|won|finished|finally/.test(t))
    return "That's huge — you should feel proud. 🎉";
  if (/friend|reconnect|long.lost|haven't seen|hadn't talked/.test(t))
    return "What a wonderful day — old friends are the best kind.";
  if (/cry|crying|terrible|awful|bad news|loss|lost|funeral|sick/.test(t))
    return "I'm so sorry. Let yourself feel all of it. 💛";
  if (/argument|fight|annoy|frustrat|angry|mad/.test(t))
    return "That sounds really draining. Take a beat — you don't have to fix it tonight.";
  if (/tired|exhaust|burnt|burned out|drain/.test(t))
    return "You've been carrying a lot. Rest counts as productive.";
  if (/anxious|worried|nervous|spiral|panic/.test(t))
    return "Anxiety lies. You've gotten through every hard day so far.";
  if (/walk|run|hike|gym|yoga|outside|park|sun/.test(t))
    return "Movement and fresh air — your body thanks you.";
  if (/cook|baked|made dinner|made breakfast|recipe/.test(t))
    return "Feeding yourself well is a love language.";
  if (/quiet|slow|read|book|tea|nap|rest/.test(t))
    return "Quiet days are not wasted days.";
  if (moodKey === 'rad')   return "Hold onto this one — you've earned it. ✨";
  if (moodKey === 'good')  return "Sounds like a good one. Glad you wrote.";
  if (moodKey === 'meh')   return "Some days are just middle days. That's okay.";
  if (moodKey === 'down')  return "Hard days are still days you got through. 💛";
  if (moodKey === 'awful') return "I'm here. Be gentle with yourself tonight.";
  return "Thanks for sharing this with me.";
}
