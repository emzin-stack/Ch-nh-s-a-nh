'use client';

/**
 * ─── LanguageToggle ───────────────────────────────────────────────────────────
 * NEW FILE: components/ui/LanguageToggle.tsx
 *
 * A pill-style EN / VI switcher. Drop it anywhere — it's already used in Navbar.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useI18n } from '@/lib/i18n';

export function LanguageToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div
      className="flex items-center gap-1.5"
      role="group"
      aria-label="Language switcher"
    >
      {(['en', 'vi'] as const).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            aria-pressed={active}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              fontSize: '12px',
              background: active
                ? 'linear-gradient(135deg, #22d3ee, #0ea5e9)'
                : 'var(--surface-2)',
              color: active ? '#000' : 'var(--text-muted)',
              border: active
                ? '1px solid transparent'
                : '1px solid var(--border-md)',
              boxShadow: active ? '0 0 12px rgba(34,211,238,0.3)' : 'none',
            }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>
            </span>
            {l === 'en' ? 'EN' : 'VI'}
          </button>
        );
      })}
    </div>
  );
}