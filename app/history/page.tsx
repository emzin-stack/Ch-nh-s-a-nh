'use client';

/**
 * MODIFIED FILE: app/history/page.tsx
 *
 * Changes vs original:
 *   1. import useI18n
 *   2. const { t } = useI18n() inside component
 *   3. Replace: page title, subtitle, button labels, empty state, cap note,
 *      loading label, sign-in prompt
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useHistory';
import { useI18n } from '@/lib/i18n'; // ← NEW
import { Navbar } from '@/components/ui/Navbar';
import { HistoryCard } from '@/components/history/HistoryCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { History, ImageIcon, Lock } from 'lucide-react';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { history, loading, deleteRecord } = useHistory(user?.id ?? null);
  const { t } = useI18n(); // ← NEW

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <LoadingSpinner size={28} label={t('loading')} /> {/* ← t() */}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <Lock size={32} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>{t('signin_to_view')}</p> {/* ← t() */}
          <Link href="/login" className="mt-3 inline-block text-sm" style={{ color: 'var(--accent)' }}>
            {t('signin_arrow')} {/* ← t() */}
          </Link>
        </div>
      </div>
    );
  }

  // ← subtitle chooses singular/plural key (both are identical in EN & VI here, but kept separate for flexibility)
  const subtitleKey = history.length === 1 ? 'history_subtitle' : 'history_subtitle_pl';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History size={18} style={{ color: 'var(--accent)' }} />
              <h1 className="text-2xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                {t('history_title')} {/* ← t() */}
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {t(subtitleKey, { count: history.length })} {/* ← t() with var */}
            </p>
          </div>

          <Link
            href="/editor"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)', color: '#000' }}
          >
            <ImageIcon size={14} />
            {t('history_new_edit')} {/* ← t() */}
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size={28} label={t('history_loading')} /> {/* ← t() */}
          </div>
        ) : history.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}>
              <History size={28} />
            </div>
            <div className="text-center">
              <p className="font-semibold" style={{ color: 'var(--text)' }}>{t('history_empty_title')}</p> {/* ← t() */}
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{t('history_empty_sub')}</p> {/* ← t() */}
            </div>
            <Link
              href="/editor"
              className="mt-2 px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)', color: '#000' }}
            >
              {t('history_open_editor')} {/* ← t() */}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((record, i) => (
              <div key={record.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}>
                <HistoryCard record={record} onDelete={deleteRecord} />
              </div>
            ))}
          </div>
        )}

        {history.length > 0 && (
          <p className="mt-8 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            {t('history_cap_note')} {/* ← t() */}
          </p>
        )}
      </main>
    </div>
  );
}