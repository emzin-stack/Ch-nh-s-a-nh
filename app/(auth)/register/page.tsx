'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';
import { Zap, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

// ─── Reusable field wrapper (flex row, no absolute positioning) ───────────────
function IconInput({
  icon,
  error: hasError = false,
  children,
}: {
  icon: React.ReactNode;
  error?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex items-center rounded-xl overflow-hidden transition-all"
      style={{
        background: 'var(--surface-2)',
        border: `1px solid ${hasError ? 'rgba(244,63,94,0.5)' : 'var(--border-md)'}`,
      }}
      onFocusCapture={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            hasError ? 'rgba(244,63,94,0.5)' : 'var(--border-md)';
        }
      }}
    >
      {/* Left icon slot — fixed 44px */}
      <span
        className="flex items-center justify-center shrink-0"
        style={{ width: '44px', color: 'var(--text-muted)' }}
      >
        {icon}
      </span>

      {/* Content (input + optional right button) fills the rest */}
      {children}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
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
    if (password.length < 6) { setError(t('register_err_short')); return; }
    if (password !== confirmPw) { setError(t('register_err_mismatch')); return; }
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

  // Shared input style — no horizontal padding; flex handles spacing
  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text)',
    fontSize: '14px',
    padding: '10px 0',
    flex: 1,
    minWidth: 0, // prevents text from forcing the flex row to overflow
  };

  // Eye toggle button — same fixed width as the left icon slot for symmetry
  const EyeButton = () => (
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
  );

  const confirmMismatch = confirmPw.length > 0 && confirmPw !== password;

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399' }}>
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
        {/* Logo */}
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

            {/* ── Email ── */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('register_email_label')}
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
                {t('register_password_label')}
              </label>
              <IconInput icon={<Lock size={16} />}>
                {/*
                  input has flex:1 + minWidth:0 → shrinks to whatever space
                  remains after the lock icon (44px) and eye button (44px).
                  No text can bleed under the eye icon.
                */}
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  style={inputStyle}
                />
                <EyeButton />
              </IconInput>
            </div>

            {/* ── Confirm Password ── */}
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>
                {t('register_confirm_label')}
              </label>
              {/*
                error prop drives the red border on the wrapper — the input
                itself has no padding concern because flex handles the layout.
              */}
              <IconInput icon={<Lock size={16} />} error={confirmMismatch}>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                  placeholder="Repeat password"
                  style={inputStyle}
                />
                {/* Eye button on confirm field too — same toggle, consistent UX */}
                <EyeButton />
              </IconInput>
              {/* Mismatch hint appears BELOW the field, never inside it */}
              {confirmMismatch && (
                <p className="mt-1.5 text-xs" style={{ color: '#f43f5e', paddingLeft: '4px' }}>
                  {t('register_err_mismatch')}
                </p>
              )}
            </div>

            {/* Error banner (server-side errors) */}
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