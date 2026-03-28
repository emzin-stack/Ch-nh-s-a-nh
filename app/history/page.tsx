'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useHistory } from '@/hooks/useHistory';
import { Navbar } from '@/components/ui/Navbar';
import { HistoryCard } from '@/components/history/HistoryCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { History, ImageIcon, Lock } from 'lucide-react';

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { history, loading, deleteRecord } = useHistory(user?.id ?? null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <LoadingSpinner size={28} label="Loading…" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <Lock size={32} className="mx-auto mb-4" style={{ color: 'var(--text-muted)' }} />
          <p style={{ color: 'var(--text-muted)' }}>Please sign in to view history.</p>
          <Link href="/login" className="mt-3 inline-block text-sm" style={{ color: 'var(--accent)' }}>
            Sign in →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <History size={18} style={{ color: 'var(--accent)' }} />
              <h1
                className="text-2xl font-extrabold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}
              >
                Edit History
              </h1>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Your last {history.length} edited image{history.length !== 1 ? 's' : ''} · Max 10 saved
            </p>
          </div>

          <Link
            href="/editor"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)', color: '#000' }}
          >
            <ImageIcon size={14} />
            New Edit
          </Link>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner size={28} label="Loading history…" />
          </div>
        ) : history.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-4 py-24 rounded-2xl"
            style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
            >
              <History size={28} />
            </div>
            <div className="text-center">
              <p className="font-semibold" style={{ color: 'var(--text)' }}>No edits yet</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Start editing images and your history will appear here.
              </p>
            </div>
            <Link
              href="/editor"
              className="mt-2 px-5 py-2.5 rounded-xl text-sm font-medium"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)', color: '#000' }}
            >
              Open Editor
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {history.map((record, i) => (
              <div
                key={record.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'both' }}
              >
                <HistoryCard record={record} onDelete={deleteRecord} />
              </div>
            ))}
          </div>
        )}

        {/* Info footer */}
        {history.length > 0 && (
          <p className="mt-8 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            History is capped at 10 entries. Oldest records are automatically removed.
          </p>
        )}
      </main>
    </div>
  );
}