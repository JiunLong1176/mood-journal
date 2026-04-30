// Sample journal data — last ~6 weeks of entries with moods + AI replies.
// Moods are a small enumerated set so calendar/insights can summarize cleanly.

const MOODS = [
  { key: 'rad',    emoji: '😄', label: 'Rad',    color: '#E8B04A' },
  { key: 'good',   emoji: '🙂', label: 'Good',   color: '#7A9B6E' },
  { key: 'meh',    emoji: '😐', label: 'Meh',    color: '#B8A99A' },
  { key: 'down',   emoji: '🙁', label: 'Down',   color: '#6B8AB8' },
  { key: 'awful',  emoji: '😣', label: 'Awful',  color: '#C16A6A' },
];

const MOOD_BY_KEY = Object.fromEntries(MOODS.map(m => [m.key, m]));

// Generate dates relative to "today" = Apr 29 2026 (Wed)
const TODAY = new Date(2026, 3, 29);
const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const daysAgo = (n) => { const d = new Date(TODAY); d.setDate(d.getDate() - n); return d; };

// Each entry: { date, mood, messages: [{from:'me'|'ai', text, time}] }
const ENTRIES = [
  {
    date: daysAgo(0), mood: 'good',
    messages: [
      { from: 'me', text: 'Walked to the bakery before work. The sourdough was still warm.', time: '08:14' },
      { from: 'ai', text: 'Mornings like that are little gifts. Glad you got one today. ☀️', time: '08:14' },
      { from: 'me', text: 'Also caught up with Maya on a long call after lunch. We hadn\'t talked in months.', time: '14:32' },
      { from: 'ai', text: 'What a wonderful day — you must be happy that you reconnected with a long-lost friend.', time: '14:32' },
    ],
  },
  {
    date: daysAgo(1), mood: 'meh',
    messages: [
      { from: 'me', text: 'Long meetings. I felt like a ghost in my own calendar.', time: '17:48' },
      { from: 'ai', text: 'Some days are just like that. You showed up — that counts.', time: '17:48' },
    ],
  },
  {
    date: daysAgo(2), mood: 'rad',
    messages: [
      { from: 'me', text: 'Got the promotion!! I almost cried in the meeting.', time: '11:02' },
      { from: 'ai', text: 'That\'s incredible — you\'ve been working toward this for ages. Celebrate tonight. 🎉', time: '11:02' },
    ],
  },
  { date: daysAgo(3), mood: 'good', messages: [
    { from: 'me', text: 'Cooked a real dinner instead of takeout. Pasta with lemon and chili.', time: '20:11' },
    { from: 'ai', text: 'Cooking for yourself is its own kind of love. Sounds lovely.', time: '20:11' },
  ]},
  { date: daysAgo(4), mood: 'down', messages: [
    { from: 'me', text: 'Got into a stupid argument with my brother about nothing.', time: '21:30' },
    { from: 'ai', text: 'Family stuff cuts deep, even when it\'s small. Sleep on it. 💛', time: '21:30' },
  ]},
  { date: daysAgo(5), mood: 'good', messages: [
    { from: 'me', text: 'Long run by the river. Saw three herons.', time: '07:55' },
    { from: 'ai', text: 'Three herons feels like a sign of something good.', time: '07:55' },
  ]},
  { date: daysAgo(6), mood: 'meh', messages: [
    { from: 'me', text: 'Tired. Slept badly. Coffee not helping.', time: '10:20' },
    { from: 'ai', text: 'Be gentle with yourself today. Early night maybe?', time: '10:20' },
  ]},
  { date: daysAgo(7), mood: 'good', messages: [{ from:'me', text:'Quiet Sunday. Read most of the afternoon.', time:'15:00'}, {from:'ai', text:'Sounds restorative. 📖', time:'15:00'}]},
  { date: daysAgo(8), mood: 'rad', messages: [{ from:'me', text:'Concert with Sam — front row. Voice gone today but worth it.', time:'23:40'}, {from:'ai', text:'Lost-voice level fun is the best level.', time:'23:40'}]},
  { date: daysAgo(9), mood: 'good', messages: [{ from:'me', text:'Finally fixed the squeaky door.', time:'18:00'}, {from:'ai', text:'Small wins count. ✨', time:'18:00'}]},
  { date: daysAgo(10), mood: 'down', messages: [{ from:'me', text:'Anxious all day. No clear reason.', time:'22:15'}, {from:'ai', text:'You don\'t need a reason for hard days. I\'m glad you wrote.', time:'22:15'}]},
  { date: daysAgo(11), mood: 'meh', messages: [{ from:'me', text:'Rainy. Worked from bed half the morning.', time:'12:00'}, {from:'ai', text:'Bed-mornings on rainy days are allowed.', time:'12:00'}]},
  { date: daysAgo(12), mood: 'good', messages: [{ from:'me', text:'Made tea for a stranger at the coffee shop who forgot their wallet.', time:'09:45'}, {from:'ai', text:'That\'ll stay with them. And probably with you.', time:'09:45'}]},
  { date: daysAgo(13), mood: 'good', messages: [{ from:'me', text:'Slow morning, croissant, magazine.', time:'10:30'}, {from:'ai', text:'A perfect Saturday opener.', time:'10:30'}]},
  { date: daysAgo(14), mood: 'rad', messages: [{ from:'me', text:'Mom\'s visiting next month — we just booked the trip!', time:'19:00'}, {from:'ai', text:'Something to look forward to. 💛', time:'19:00'}]},
  { date: daysAgo(15), mood: 'meh', messages: [{ from:'me', text:'Just a long Thursday.', time:'21:00'}, {from:'ai', text:'Long Thursdays are a real category. You made it.', time:'21:00'}]},
  { date: daysAgo(16), mood: 'good', messages: [{ from:'me', text:'New plant — a fiddle leaf. Naming her Greta.', time:'17:30'}, {from:'ai', text:'Welcome, Greta. 🌿', time:'17:30'}]},
  { date: daysAgo(17), mood: 'awful', messages: [{ from:'me', text:'Got really bad news about Aunt June. I can\'t stop crying.', time:'20:50'}, {from:'ai', text:'I\'m so sorry. Let yourself feel all of it. 💛', time:'20:50'}]},
  { date: daysAgo(18), mood: 'down', messages: [{ from:'me', text:'Couldn\'t focus on anything. Kept refreshing my phone.', time:'16:00'}, {from:'ai', text:'Brain in fog mode. It will lift.', time:'16:00'}]},
  { date: daysAgo(19), mood: 'good', messages: [{ from:'me', text:'Dinner party at Theo\'s. Burned the bread, no one cared.', time:'23:00'}, {from:'ai', text:'Burned bread = best dinner-party story.', time:'23:00'}]},
  { date: daysAgo(20), mood: 'good', messages: [{ from:'me', text:'Gym day. Two miles + some weights.', time:'07:00'}, {from:'ai', text:'Future-you says thanks. 💪', time:'07:00'}]},
  { date: daysAgo(21), mood: 'rad', messages: [{ from:'me', text:'Painted for three hours. Lost track of time in the best way.', time:'14:00'}, {from:'ai', text:'Flow states are sacred. Glad you found one.', time:'14:00'}]},
  { date: daysAgo(22), mood: 'meh', messages: [{ from:'me', text:'Nothing much. Watched a so-so movie.', time:'22:00'}, {from:'ai', text:'A so-so movie is still a movie. 🎬', time:'22:00'}]},
  { date: daysAgo(23), mood: 'good', messages: [{ from:'me', text:'Coffee with Priya, finally.', time:'11:00'}, {from:'ai', text:'Catch-ups are the best part of the week.', time:'11:00'}]},
  { date: daysAgo(24), mood: 'good', messages: [{ from:'me', text:'Big work win — shipped the redesign.', time:'18:30'}, {from:'ai', text:'You\'ve earned a quiet evening. 🥂', time:'18:30'}]},
  { date: daysAgo(25), mood: 'down', messages: [{ from:'me', text:'Comparison spiral on Instagram. Closed the app, took a walk.', time:'13:00'}, {from:'ai', text:'Recognizing it and stepping away — that\'s a skill.', time:'13:00'}]},
  { date: daysAgo(26), mood: 'good', messages: [{ from:'me', text:'Long phone call with Dad. He told the same story twice. I let him.', time:'19:20'}, {from:'ai', text:'That\'s love.', time:'19:20'}]},
  { date: daysAgo(27), mood: 'meh', messages: [{ from:'me', text:'Headache all day.', time:'20:00'}, {from:'ai', text:'Hope tomorrow is gentler. 💧', time:'20:00'}]},
  { date: daysAgo(28), mood: 'good', messages: [{ from:'me', text:'Cleaned the whole apartment. Smells like lemons.', time:'16:00'}, {from:'ai', text:'Clean apartment = clean head, sometimes.', time:'16:00'}]},
  { date: daysAgo(29), mood: 'rad', messages: [{ from:'me', text:'Surprise package from Lin! She remembered my birthday a week early.', time:'12:30'}, {from:'ai', text:'Friends who remember the small things are gold.', time:'12:30'}]},
  { date: daysAgo(30), mood: 'good', messages: [{ from:'me', text:'Tried a new ramen place. 9/10.', time:'19:30'}, {from:'ai', text:'Ramen scoring is a serious art. 🍜', time:'19:30'}]},
  { date: daysAgo(31), mood: 'good', messages: [{ from:'me', text:'Actually closed my laptop at 5.', time:'17:00'}, {from:'ai', text:'A radical act. Keep going.', time:'17:00'}]},
  { date: daysAgo(32), mood: 'meh', messages: [{ from:'me', text:'Allergies destroying me.', time:'15:00'}, {from:'ai', text:'May the pollen pass. 🤧', time:'15:00'}]},
  { date: daysAgo(33), mood: 'good', messages: [{ from:'me', text:'Sunset from the rooftop with tea.', time:'18:45'}, {from:'ai', text:'Sounds like a postcard.', time:'18:45'}]},
  { date: daysAgo(34), mood: 'down', messages: [{ from:'me', text:'Missed the deadline. Boss was nice but I feel terrible.', time:'21:00'}, {from:'ai', text:'One miss isn\'t the whole story. You\'ll regroup.', time:'21:00'}]},
  { date: daysAgo(35), mood: 'good', messages: [{ from:'me', text:'Pickleball with the team. I\'m bad but having fun.', time:'19:00'}, {from:'ai', text:'Bad-but-fun is the sweet spot. 🥒', time:'19:00'}]},
  { date: daysAgo(36), mood: 'good', messages: [{ from:'me', text:'Slow Sunday. Pancakes.', time:'10:00'}, {from:'ai', text:'Pancake Sundays. 🥞', time:'10:00'}]},
  { date: daysAgo(37), mood: 'rad', messages: [{ from:'me', text:'Saw the cherry blossoms peak today. Took 200 photos.', time:'14:30'}, {from:'ai', text:'Worth every photo. 🌸', time:'14:30'}]},
];

const ENTRIES_BY_DATE = Object.fromEntries(ENTRIES.map(e => [dayKey(e.date), e]));

// AI reply generator — picks an empathetic short reply based on mood + keywords.
// Friend-style validation, no follow-up questions.
function aiReply(text, moodKey) {
  const t = text.toLowerCase();
  if (/promot|raise|got the job|landed|launched|shipped|won|finished|finally/.test(t)) return "That's huge — you should feel proud. 🎉";
  if (/friend|maya|sam|lin|priya|theo|reconnect|long.lost|haven't seen|hadn't talked/.test(t)) return "What a wonderful day — old friends are the best kind.";
  if (/cry|crying|terrible|awful|bad news|loss|lost|funeral|sick/.test(t)) return "I'm so sorry. Let yourself feel all of it. 💛";
  if (/argument|fight|annoy|frustrat|angry|mad/.test(t)) return "That sounds really draining. Take a beat — you don't have to fix it tonight.";
  if (/tired|exhaust|burnt|burned out|drain/.test(t)) return "You've been carrying a lot. Rest counts as productive.";
  if (/anxious|worried|nervous|spiral|panic/.test(t)) return "Anxiety lies. You've gotten through every hard day so far.";
  if (/walk|run|hike|gym|yoga|outside|park|sun/.test(t)) return "Movement and fresh air — your body thanks you.";
  if (/cook|baked|made dinner|made breakfast|recipe/.test(t)) return "Feeding yourself well is a love language.";
  if (/quiet|slow|read|book|tea|nap|rest/.test(t)) return "Quiet days are not wasted days.";
  if (moodKey === 'rad')   return "Hold onto this one — you've earned it. ✨";
  if (moodKey === 'good')  return "Sounds like a good one. Glad you wrote.";
  if (moodKey === 'meh')   return "Some days are just middle days. That's okay.";
  if (moodKey === 'down')  return "Hard days are still days you got through. 💛";
  if (moodKey === 'awful') return "I'm here. Be gentle with yourself tonight.";
  return "Thanks for sharing this with me.";
}

Object.assign(window, { MOODS, MOOD_BY_KEY, ENTRIES, ENTRIES_BY_DATE, TODAY, dayKey, aiReply });
