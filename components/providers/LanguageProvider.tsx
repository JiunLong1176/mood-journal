'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { en } from '@/lib/i18n/en';
import { zh } from '@/lib/i18n/zh';
import type { Strings } from '@/lib/i18n/en';

export type Language = 'en' | 'zh';

const STRINGS: Record<Language, Strings> = { en, zh };

interface LangCtx {
  language: Language;
  t: Strings;
  setLanguage: (lang: Language) => void;
}

const Ctx = createContext<LangCtx>({
  language: 'en',
  t: en,
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLangState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('beans_language') as Language | null;
    if (saved === 'en' || saved === 'zh') setLangState(saved);
  }, []);

  function setLanguage(lang: Language) {
    setLangState(lang);
    localStorage.setItem('beans_language', lang);
  }

  return (
    <Ctx.Provider value={{ language, t: STRINGS[language], setLanguage }}>
      {children}
    </Ctx.Provider>
  );
}

export const useTranslation = () => useContext(Ctx);
