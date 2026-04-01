'use client';

/**
 * MODIFIED FILE: app/page.tsx
 *
 * Changes vs original:
 *   1. import useI18n
 *   2. const { t } = useI18n() inside component
 *   3. feature cards array moved inside component (needs t())
 *   4. Replace all hardcoded strings with t()
 */

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useI18n } from '@/lib/i18n'; // NEW
import { Navbar } from '@/components/ui/Navbar';
import {
  Zap, Crop, ArrowLeftRight, Download, History, Shield,
  Image as ImageIcon, ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { t } = useI18n(); // NEW

  // Moved inside component so t() is available for title/desc
  const features = [
    { icon: Zap,            title: t('feat_compress_title'), desc: t('feat_compress_desc') },
    { icon: Crop,           title: t('feat_crop_title'),     desc: t('feat_crop_desc') },
    { icon: ArrowLeftRight, title: t('feat_compare_title'),  desc: t('feat_compare_desc') },
    { icon: Download,       title: t('feat_download_title'), desc: t('feat_download_desc') },
    { icon: History,        title: t('feat_history_title'),  desc: t('feat_history_desc') },
    { icon: Shield,         title: t('feat_secure_title'),   desc: t('feat_secure_desc') },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <main className="flex-1">
        <section className="relative pt-28 pb-20 px-6 text-center overflow-hidden">
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(34,211,238,0.08) 0%, transparent 70%)' }}
          />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(rgba(34,211,238,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.05) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />

          <div className="relative z-10 max-w-3xl mx-auto animate-fade-in">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium tracking-widest uppercase"
              style={{ background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', color: 'var(--accent)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-slow" />
              {t('home_badge')}
            </div>

            <h1
              className="text-5xl md:text-7xl font-extrabold leading-none mb-6 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('home_headline_1')}{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t('home_headline_2')}
              </span>
            </h1>

            <p className="text-lg mb-10" style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
              {t('home_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/editor"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #0ea5e9)', color: '#000', boxShadow: '0 0 24px rgba(34,211,238,0.3)' }}
              >
                <ImageIcon size={16} />
                {t('home_cta_editor')}
                <ChevronRight size={16} />
              </Link>
              {!user && (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border-md)', color: 'var(--text)' }}
                >
                  {t('home_cta_register')}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Feature cards */}
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', animationDelay: `${i * 60}ms`, animationFillMode: 'both' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--accent)' }}
                  >
                    <f.icon size={20} />
                  </div>
                  <h3 className="font-semibold text-base mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--text)' }}>
                    {f.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 py-6 text-center text-xs" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
        {t('home_footer')}
      </footer>
    </div>
  );
}