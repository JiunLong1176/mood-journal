import type { Strings } from './en';

export const zh = {
  moods: {
    rad:   '棒极了',
    good:  '不错',
    meh:   '一般',
    down:  '难过',
    awful: '糟透了',
  },

  tabs: {
    today:    '今天',
    calendar: '日历',
    entries:  '记录',
    insights: '洞察',
    profile:  '我的',
  },

  today: {
    greetingPrefix: (hour: number) =>
      hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好',
    greetingSep:    '，',
    hintNone:       '选择今天的心情，然后告诉我你的一天。',
    hintMoodPicked: (label: string, emoji: string) => `你感觉${label} ${emoji}。说说发生了什么。`,
    placeholderMood:   '现在在想什么？',
    placeholderNoMood: '请先选择一个心情…',
    fallbackReply:     '谢谢你与我分享。',
  },

  archive: {
    title:            '记录',
    subtitle:         (n: number) => `${n} 条记忆`,
    searchPlaceholder: '搜索记录…',
    filterAll:        '全部',
    emptyNoEntries:   '还没有记录，去「今天」开始写吧。',
    emptyFiltered:    '没有找到相关记录。',
  },

  calendar: {
    title:    '心情日历',
    subtitle: (n: number) => `本月已记录 ${n} 天`,
    weekdays: ['日', '一', '二', '三', '四', '五', '六'] as string[],
    thisMonth: '本月',
  },

  insights: {
    title:        '洞察',
    subtitle:     '最近 30 天',
    mostly:       '主要是',
    daysLabel:    (label: string) => `${label}的日子`,
    ofLast:       (count: number, total: number) => `最近 ${total} 条记录中有 ${count} 条`,
    streakLabel:  '当前连续',
    streakUnit:   (_n: number) => '天',
    totalLabel:   '全部记录',
    totalUnit:    '条记忆',
    moodBreakdown: '心情分布',
    byDayOfWeek:  '按星期',
    byDaySubtitle: '你在哪天通常更开心',
    wordCloud:    '你写了些什么',
    emptyState:   '开始写日记，在这里查看你的心情洞察。',
    weekdays:     ['日', '一', '二', '三', '四', '五', '六'] as string[],
  },

  settings: {
    headerTitle:     '我的',
    memberSince:     (date: string) => `加入于 ${date}`,
    entriesCount:    (n: number) => `${n} 条记录`,
    streakActive:    (n: number) => `你已连续记录 ${n} 天`,
    streakActiveSub: '明天继续，保持这个习惯。',
    streakNone:      '还没有连续记录',
    streakNoneSub:   '今天写一篇，开始你的连续记录。',
    themeTitle:      '主题',
    themeNames: {
      cream:    '奶白',
      dusk:     '黄昏',
      notebook: '笔记本',
    } as Record<string, string>,
    aiTitle:    'AI 回复',
    aiSubtitle: '日记应该如何回应你？',
    aiTones: {
      friend:     { label: '像朋友一样',  desc: '温暖、支持、简短' },
      reflective: { label: '反思型',      desc: '回应你写作中的主题' },
      spark:      { label: 'Spark ✨',    desc: '充满活力，热情，带表情符号' },
      quiet:      { label: '安静模式',    desc: '不回复 — 只是写' },
    } as Record<string, { label: string; desc: string }>,
    reminderTitle: '每日提醒',
    reminderLabel: '提醒我写日记',
    reminderTime:  '时间',
    languageTitle: '语言',
    languageEN:    'English',
    languageZH:    '中文',
  },

  login: {
    tagline:             '你的每日心情与反思空间。',
    emailPlaceholder:    '你的邮箱',
    passwordPlaceholder: '密码',
    signInButton:        '登录',
    signUpButton:        '注册',
    signingInButton:     '登录中…',
    signingUpButton:     '注册中…',
    switchToSignUp:      '没有账号？注册',
    switchToSignIn:      '已有账号？登录',
    errorInvalidCredentials: '邮箱或密码错误。',
    errorEmailInUse:     '该邮箱已被注册。',
    errorGeneric:        '出了点问题，请重试。',
    forgotPassword:      '忘记密码？',
  },

  forgotPasswordPage: {
    title:            '忘记密码？',
    subtitle:         '输入邮箱，我们将发送重置链接。',
    emailPlaceholder: '你的邮箱',
    submitButton:     '发送重置链接',
    submittingButton: '发送中…',
    successMessage:   '请查收邮件中的重置链接。',
    backToSignIn:     '返回登录',
    errorGeneric:     '出了点问题，请重试。',
  },

  resetPassword: {
    title:           '重置密码',
    newPassword:     '新密码',
    confirmPassword: '确认密码',
    submitButton:    '更新密码',
    submittingButton: '更新中…',
    errorMismatch:   '两次密码不一致。',
    errorGeneric:    '出了点问题，请重试。',
    successMessage:  '密码已更新！正在跳转…',
  },

  entryDetail: {
    notFound: '当天没有找到记录。',
  },
} satisfies Strings;
