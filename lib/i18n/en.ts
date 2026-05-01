export const en = {
  moods: {
    rad:   'Rad',
    good:  'Good',
    meh:   'Meh',
    down:  'Down',
    awful: 'Awful',
  },

  tabs: {
    today:    'Today',
    calendar: 'Calendar',
    entries:  'Entries',
    insights: 'Insights',
    profile:  'Profile',
  },

  today: {
    greetingPrefix: (hour: number): string =>
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening',
    greetingSep:    ', ',
    hintNone:       "Pick how you're feeling, then tell me about your day.",
    hintMoodPicked: (label: string, emoji: string) => `You're feeling ${label} ${emoji}. Tell me about it.`,
    placeholderMood:   "What's on your mind?",
    placeholderNoMood: 'Pick a mood first…',
    fallbackReply:     'Thanks for sharing this with me.',
  },

  archive: {
    title:            'Entries',
    subtitle:         (n: number) => `${n} ${n === 1 ? 'memory' : 'memories'}`,
    searchPlaceholder: 'Search entries…',
    filterAll:        'All',
    emptyNoEntries:   'No entries yet. Start writing on the Today tab.',
    emptyFiltered:    'No entries found.',
  },

  calendar: {
    title:    'Mood calendar',
    subtitle: (n: number) => `${n} day${n === 1 ? '' : 's'} logged this month`,
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as string[],
    thisMonth: 'This month',
  },

  insights: {
    title:        'Insights',
    subtitle:     'Last 30 days',
    mostly:       'Mostly',
    daysLabel:    (label: string) => `${label} days`,
    ofLast:       (count: number, total: number) => `${count} of your last ${total} entries`,
    streakLabel:  'Current streak',
    streakUnit:   (n: number): string => n === 1 ? 'day' : 'days',
    totalLabel:   'Total entries',
    totalUnit:    'memories',
    moodBreakdown: 'Mood breakdown',
    byDayOfWeek:  'By day of week',
    byDaySubtitle: 'How happy you tend to feel',
    wordCloud:    'What you wrote about',
    emptyState:   'Start journaling to see your mood insights here.',
    weekdays:     ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as string[],
  },

  settings: {
    headerTitle:     'Profile',
    memberSince:     (date: string) => `Member since ${date}`,
    entriesCount:    (n: number) => `${n} ${n === 1 ? 'entry' : 'entries'}`,
    streakActive:    (n: number) => `You're on a ${n}-day streak`,
    streakActiveSub: 'Show up tomorrow to keep it going.',
    streakNone:      'No active streak yet',
    streakNoneSub:   'Write today to start one.',
    themeTitle:      'Theme',
    themeNames: {
      cream:    'Cream',
      dusk:     'Dusk',
      notebook: 'Notebook',
    } as Record<string, string>,
    aiTitle:    'AI replies',
    aiSubtitle: 'How should your journal respond?',
    aiTones: {
      friend:     { label: 'Like a friend',  desc: 'Warm, validating, brief' },
      reflective: { label: 'Reflective',     desc: 'Mirrors back themes' },
      quiet:      { label: 'Quiet mode',     desc: 'No replies — just write' },
    } as Record<string, { label: string; desc: string }>,
    reminderTitle: 'Daily reminder',
    reminderLabel: 'Remind me to write',
    reminderTime:  'Time',
    languageTitle: 'Language',
    languageEN:    'English',
    languageZH:    '中文',
  },

  login: {
    tagline:             'Your daily mood & reflection space.',
    emailPlaceholder:    'your@email.com',
    passwordPlaceholder: 'Password',
    signInButton:        'Sign In',
    signUpButton:        'Sign Up',
    signingInButton:     'Signing in…',
    signingUpButton:     'Signing up…',
    switchToSignUp:      "Don't have an account? Sign up",
    switchToSignIn:      'Already have an account? Sign in',
    errorInvalidCredentials: 'Incorrect email or password.',
    errorEmailInUse:     'An account with this email already exists.',
    errorGeneric:        'Something went wrong. Please try again.',
    forgotPassword:      'Forgot password?',
  },

  resetPassword: {
    title:           'Reset password',
    newPassword:     'New password',
    confirmPassword: 'Confirm password',
    submitButton:    'Update password',
    submittingButton: 'Updating…',
    errorMismatch:   'Passwords do not match.',
    errorGeneric:    'Something went wrong. Please try again.',
    successMessage:  'Password updated! Redirecting…',
  },

  entryDetail: {
    notFound: 'No entry found for this day.',
  },
};

export type Strings = typeof en;
