'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { THEMES, ThemeName, Theme } from '@/lib/themes';

interface ThemeCtx {
  themeName: ThemeName;
  theme: Theme;
  setTheme: (name: ThemeName) => void;
}

const Ctx = createContext<ThemeCtx>({
  themeName: 'cream',
  theme: THEMES.cream,
  setTheme: () => {},
});

export function ThemeProvider({
  children,
  initialTheme = 'cream',
}: {
  children: React.ReactNode;
  initialTheme?: ThemeName;
}) {
  const [themeName, setThemeName] = useState<ThemeName>(initialTheme);

  // Persist theme choice in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('beans_theme') as ThemeName | null;
    if (saved && saved in THEMES) setThemeName(saved);
  }, []);

  function setTheme(name: ThemeName) {
    setThemeName(name);
    localStorage.setItem('beans_theme', name);
  }

  return (
    <Ctx.Provider value={{ themeName, theme: THEMES[themeName], setTheme }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTheme = () => useContext(Ctx);
