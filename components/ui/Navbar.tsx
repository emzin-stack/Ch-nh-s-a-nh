'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n';                           // ← NEW
import { LanguageToggle } from '@/components/ui/LanguageToggle'; // ← NEW
import { Zap, History, LogOut, LogIn, UserPlus, Image as ImageIcon } from 'lucide-react';

export function Navbar() {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();
  const { t } = useI18n(); // ← NEW

  const navLink = (href: string, label: string, icon: React.ReactNode) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
        style={{
          color: active ? 'var(--accent)' : 'var(--text-muted)',
          background: active ? 'rgba(34,211,238,0.08)' : 'transparent',
        }}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-14"
      style={{
        background: 'rgba(10,13,20,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)' }}
        >
          <Zap size={14} className="text-black" />
        </div>
        <span
          className="font-extrabold text-base tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
        >
          PixelForge
        </span>
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-1">
        {navLink('/editor', t('nav_editor'), <ImageIcon size={14} />)}
        {user && navLink('/history', t('nav_history'), <History size={14} />)}
      </div>

      {/* Auth actions */}
      <div className="flex items-center gap-2">
        <LanguageToggle /> {/* ← NEW */}
        {loading ? (
          <div className="w-20 h-7 rounded-lg shimmer" />
        ) : user ? (
          <>
            <span className="hidden md:block text-xs" style={{ color: 'var(--text-muted)' }}>
              {user.email?.split('@')[0]}
            </span>
            <button
              onClick={signOut}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 hover:opacity-80"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">{t('nav_signout')}</span>
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-150 hover:opacity-80"
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                color: 'var(--text-muted)',
              }}
            >
              <LogIn size={13} />
              {t('nav_login')}
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)',
                color: '#000',
              }}
            >
              <UserPlus size={13} />
              {t('nav_register')}
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}