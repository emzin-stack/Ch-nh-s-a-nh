'use client';

import { useI18n } from '@/lib/i18n';
import { formatBytes } from '@/lib/imageProcessing';

interface Props {
  beforeUrl: string | null;
  afterUrl: string | null;
  editedSize?: number;
  originalSize?: number;
}

export function BeforeAfterSlider({ beforeUrl, afterUrl, editedSize, originalSize }: Props) {
  const { t } = useI18n();
  const hasAfter = !!afterUrl && afterUrl !== beforeUrl;

  // ── Nothing uploaded yet ───────────────────────────────────────────────────
  if (!beforeUrl) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center gap-3 rounded-2xl p-10 text-center"
        style={{
          minHeight: '340px',
          border: '1px dashed rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <svg
          width="36" height="36" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="1.4"
          style={{ color: 'var(--text-muted)', opacity: 0.35 }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
            {t('editor_no_image_title')}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', opacity: 0.55 }}>
            {t('editor_no_image_sub')}
          </p>
        </div>
      </div>
    );
  }

  // ── No edits yet — single image, full frame ────────────────────────────────
  if (!hasAfter) {
    return (
      <div
        className="w-full relative rounded-2xl overflow-hidden checkerboard"
        style={{
          background: '#0a0d14',
          border: '1px solid rgba(255,255,255,0.08)',
          minHeight: '320px',
        }}
      >
        {/* BEFORE label — top-left overlay */}
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md
                     text-[10px] font-bold uppercase tracking-widest pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.6)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {t('compare_before')}
          {originalSize != null && (
            <span className="ml-1.5 opacity-60 normal-case font-normal tracking-normal">
              {formatBytes(originalSize)}
            </span>
          )}
        </div>

        {/* Image — centered, contains proportions */}
        <img
          src={beforeUrl}
          alt={t('compare_before')}
          draggable={false}
          className="w-full h-full"
          style={{
            display: 'block',
            maxHeight: '520px',
            objectFit: 'contain',
          }}
        />

        {/* "Apply edits" hint — bottom center overlay */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2
                     px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.65)',
            color: 'var(--text-muted)',
            backdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {t('compare_no_edits')}
        </div>
      </div>
    );
  }

  // ── Both images — ONE shared horizontal frame, split down the middle ───────
  //
  // The outer box is a single rounded container. Inside it we use a CSS grid
  // with two equal columns. Both <img> elements share the SAME row height,
  // determined by the tallest image, so they are always vertically aligned.
  // A thin vertical divider with a "VS" pill sits between the two columns.
  //
  return (
    <div
      className="w-full relative rounded-2xl overflow-hidden checkerboard"
      style={{
        background: '#0a0d14',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        /* Grid: two equal columns + a 1px divider column in the middle */
        display: 'grid',
        gridTemplateColumns: '1fr 1px 1fr',
        minHeight: '320px',
      }}
    >
      {/* ── LEFT CELL: BEFORE ───────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center p-3">
        {/* Label — top-left overlay inside this cell */}
        <div
          className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md
                     text-[10px] font-bold uppercase tracking-widest pointer-events-none"
          style={{
            background: 'rgba(0,0,0,0.6)',
            color: 'rgba(255,255,255,0.75)',
            border: '1px solid rgba(255,255,255,0.12)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {t('compare_before')}
          {originalSize != null && (
            <span className="ml-1.5 opacity-60 normal-case font-normal tracking-normal">
              {formatBytes(originalSize)}
            </span>
          )}
        </div>

        <img
          src={beforeUrl}
          alt={t('compare_before')}
          draggable={false}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '500px',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>

      {/* ── CENTRE DIVIDER ──────────────────────────────────────────────── */}
      <div
        className="relative flex items-center justify-center"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      >
        {/* VS pill — centred on the divider line */}
        <div
          className="absolute flex items-center justify-center rounded-full
                     text-[9px] font-black tracking-widest z-20"
          style={{
            width: '28px',
            height: '28px',
            background: 'var(--surface-3)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--text-muted)',
            left: '50%',
            top:  '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          VS
        </div>
      </div>

      {/* ── RIGHT CELL: AFTER ───────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center p-3">
        {/* Label — top-right overlay inside this cell */}
        <div
          className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md
                     text-[10px] font-bold uppercase tracking-widest pointer-events-none"
          style={{
            background: 'rgba(34,211,238,0.18)',
            color: 'var(--accent)',
            border: '1px solid rgba(34,211,238,0.35)',
            backdropFilter: 'blur(4px)',
          }}
        >
          {t('compare_after')}
          {editedSize != null && (
            <span className="ml-1.5 opacity-70 normal-case font-normal tracking-normal">
              {formatBytes(editedSize)}
            </span>
          )}
        </div>

        <img
          src={afterUrl}
          alt={t('compare_after')}
          draggable={false}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '500px',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  );
}