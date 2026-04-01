'use client';

/**
 * MODIFIED FILE: app/(auth)/login/page.tsx
 *
 * Changes vs original:
 *   1. import useI18n
 *   2. const { t } = useI18n() inside component
 *   3. Replace every hardcoded label, placeholder hint, link text with t()
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n'; // NEW
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useI18n(); // NEW
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(167,139,250,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md animate-slide-up">
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

        <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('login_email_label')}
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-md)', color: 'var(--text)' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-md)')}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('login_password_label')}
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-md)', color: 'var(--text)' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border-md)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity"
                >
                  {showPw
                    ? <EyeOff size={14} style={{ color: 'var(--text-muted)' }} />
                    : <Eye size={14} style={{ color: 'var(--text-muted)' }} />}
                </button>
              </div>
            </div>

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