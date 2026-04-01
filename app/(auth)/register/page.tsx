'use client';

/**
 * MODIFIED FILE: app/(auth)/register/page.tsx
 *
 * Changes vs original:
 *   1. import useI18n
 *   2. const { t } = useI18n() inside component
 *   3. Replace every hardcoded string with t()
 *   4. Validation error messages use t() keys
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n'; // NEW
import { Zap, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n(); // NEW
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('register_err_short')); // t() replaces hardcoded message
      return;
    }
    if (password !== confirmPw) {
      setError(t('register_err_mismatch')); // t() replaces hardcoded message
      return;
    }

    setLoading(true);
    const { error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => router.push('/editor'), 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}
          >
            <CheckCircle size={32} />
          </div>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
            {t('register_success_title')}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {t('register_success_sub')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(34,211,238,0.05) 0%, transparent 70%)' }}
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
            {t('register_title')}
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {t('register_subtitle')}
          </p>
        </div>

        <div className="p-8 rounded-2xl" style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}>
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('register_email_label')}
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

            {/* Password */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('register_password_label')}
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
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

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('register_confirm_label')}
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: 'var(--surface-2)',
                    border: `1px solid ${confirmPw && confirmPw !== password ? 'rgba(244,63,94,0.5)' : 'var(--border-md)'}`,
                    color: 'var(--text)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--accent)')}
                  onBlur={(e) => (e.target.style.borderColor = confirmPw && confirmPw !== password ? 'rgba(244,63,94,0.5)' : 'var(--border-md)')}
                />
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
              {t('register_submit')}
            </Button>
          </form>

          <div className="mt-4 pt-4 text-center text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
            {t('register_have_account')}{' '}
            <Link href="/login" style={{ color: 'var(--accent)' }} className="hover:underline font-medium">
              {t('register_signin_link')}
            </Link>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/editor" className="text-sm hover:underline" style={{ color: 'var(--text-muted)' }}>
            {t('register_guest_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}