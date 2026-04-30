export type ThemeName = 'cream' | 'dusk' | 'notebook';

export interface Theme {
  bg: string;
  surface: string;
  surfaceAlt: string;
  ink: string;
  inkSoft: string;
  inkFaint: string;
  accent: string;
  accentSoft: string;
  sage: string;
  line: string;
  bubbleMe: string;
  bubbleMeText: string;
  bubbleAi: string;
  bubbleAiText: string;
  statusBarTint: string;
}

export const THEMES: Record<ThemeName, Theme> = {
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
