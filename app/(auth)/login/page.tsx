'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

// ─── Reusable field wrappers ──────────────────────────────────────────────────
// Using flex rows instead of absolute positioning for the eye button so the
// input text area is ALWAYS bounded by real layout — never overlaps the icon.

function IconInput({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center gap-0 rounded-xl overflow-hidden transition-all"
      style={{
        background: 'var(--surface-2)',
        border: '1px solid var(--border-md)',
      }}
      // Propagate focus-visible ring to the wrapper so it looks unified
      onFocusCapture={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
      }}
      onBlurCapture={(e) => {
        // Only reset if focus left the whole wrapper
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-md)';
        }
      }}
    >
      {/* Left icon — fixed width, never shrinks */}
      <span
        className="flex items-center justify-center shrink-0"
        style={{ width: '44px', color: 'var(--text-muted)' }}
      >
        {icon}
      </span>

      {/* The input grows to fill remaining space */}
      {children}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/editor');
    }
  };

  // Shared style for every <input> — no left/right padding needed because
  // the IconInput wrapper handles spacing via flex children.
  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    width: '100%',
    fontSize: '14px',
    padding: '10px 0',       // vertical padding only; horizontal handled by flex
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(167,139,250,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)' }}
          >
            <Zap size={22} className="text-black" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            {t('login_title')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('login_subtitle')}
          </p>
        </div>

        {/* Card */}
        <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleLogin} className="space-y-4">

            {/* ── Email ── */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('login_email_label')}
              </label>
              <IconInput icon={<Mail size={16} />}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  style={{ ...inputStyle, paddingRight: '14px' }}
                />
              </IconInput>
            </div>

            {/* ── Password ── */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('login_password_label')}
              </label>
              <IconInput icon={<Lock size={16} />}>
                {/*
                  The input and the eye button are SIBLINGS inside the flex row.
                  The input gets `flex: 1` so it fills whatever space is left
                  after the lock icon (44px) and the eye button (44px fixed).
                  Text can NEVER reach under the eye button.
                */}
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ ...inputStyle, flex: 1, minWidth: 0 }}
                />
                {/* Eye toggle — fixed 44px, same as left icon slot */}
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="shrink-0 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                  style={{ width: '44px', color: 'var(--text-muted)' }}
                  tabIndex={0}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </IconInput>
            </div>

            {/* Error */}
            {error && (
              <div
                className="px-3 py-2.5 rounded-xl text-sm"
                style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e' }}
              >
                {error}
              </div>
            )}

            <Button variant="primary" className="w-full" loading={loading} type="submit">
              {t('login_submit')}
            </Button>
          </form>

          <div className="mt-4 pt-4 text-center text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {t('login_no_account')}{' '}
            <Link href="/register" style={{ color: 'var(--accent)' }} className="hover:underline font-medium">
              {t('login_signup_link')}
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/editor" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            {t('login_guest_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}