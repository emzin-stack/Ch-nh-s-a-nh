'use client';

/**
 * ─── i18n System ─────────────────────────────────────────────────────────────
 * NEW FILE: lib/i18n.tsx
 *
 * Provides a React context with:
 *   - `lang`      → current language ('en' | 'vi')
 *   - `t(key)`    → returns the translated string
 *   - `toggleLang()` → switches between EN ↔ VI and persists to localStorage
 *
 * Wrap your root layout with <I18nProvider> to make it available everywhere.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { en } from '@/translations/en';
import { vi } from '@/translations/vi';

export type Lang = 'en' | 'vi';
export type TranslationKey = keyof typeof en;

type I18nContextType = {
  lang: Lang;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  toggleLang: () => void;
  setLang: (l: Lang) => void;
};

const translations: Record<Lang, typeof en> = { en, vi: vi as typeof en };

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  t: (key) => key as string,
  toggleLang: () => {},
  setLang: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  // Restore persisted language on mount
  useEffect(() => {
    const stored = localStorage.getItem('pf-lang') as Lang | null;
    if (stored === 'en' || stored === 'vi') setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem('pf-lang', l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'vi' : 'en');
  }, [lang, setLang]);

  /**
   * t('key')                  → plain string
   * t('key', { name: 'X' })  → replaces {{name}} in the string with 'X'
   */
  const t = useCallback(
    (key: TranslationKey, vars?: Record<string, string | number>): string => {
      let str: string = translations[lang][key] ?? translations['en'][key] ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`{{${k}}}`, 'g'), String(v));
        });
      }
      return str;
    },
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang, setLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}