'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

interface Props {
  beforeUrl: string | null;
  afterUrl: string | null;
}

export function BeforeAfterSlider({ beforeUrl, afterUrl }: Props) {
  const { t } = useI18n();
  const [sliderX, setSliderX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderX(pct);
  }, []);

  // Global mouse tracking so dragging works even if cursor leaves the container
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) updateSlider(e.clientX);
    };
    const handleGlobalMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, updateSlider]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => { updateSlider(e.touches[0].clientX); },
    [updateSlider]
  );

  // Empty state
  if (!beforeUrl && !afterUrl) {
    return (
      <div
        className="mx-auto max-w-[500px] w-full flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center"
        style={{
          minHeight: '240px',
          border: '1px dashed rgba(255,255,255,0.12)',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <ArrowLeftRight size={24} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('compare_title')}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          {t('compare_empty')}
        </p>
      </div>
    );
  }

  const hasAfter = !!afterUrl && afterUrl !== beforeUrl;

  return (
    <div className="mx-auto max-w-[700px] w-full space-y-3">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl select-none cursor-col-resize"
        style={{
          aspectRatio: '16/9',
          background: '#0a0a0a',
          touchAction: 'none',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={handleTouchMove}
      >
        {/* BOTTOM LAYER: AFTER image (full width) */}
        {afterUrl && (
          <img
            src={afterUrl}
            alt={t('compare_after')}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        )}

        {/* TOP LAYER: BEFORE image, clipped by clipPath */}
        {beforeUrl && (
          <img
            src={beforeUrl}
            alt={t('compare_before')}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{
              clipPath: `inset(0 ${100 - sliderX}% 0 0)`,
              zIndex: 5,
            }}
            draggable={false}
          />
        )}

        {hasAfter && (
          <>
            {/* AFTER label — left side (the image underneath, the edited one) */}
            <div
              className="absolute z-20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest pointer-events-none"
              style={{
                top: '14px',
                left: '14px',
                background: 'rgba(34,211,238,0.75)',
                color: '#000',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {t('compare_after')}
            </div>

            {/* BEFORE label — right side (the original clipped on top) */}
            <div
              className="absolute z-20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest pointer-events-none"
              style={{
                top: '14px',
                right: '14px',
                background: 'rgba(0,0,0,0.65)',
                color: '#fff',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {t('compare_before')}
            </div>

            {/* Divider line + drag handle */}
            <div
              className="absolute top-0 bottom-0 z-10"
              style={{
                left: `${sliderX}%`,
                width: '2px',
                background: 'rgba(255,255,255,0.9)',
                boxShadow: '0 0 12px rgba(0,0,0,0.6)',
              }}
            >
              {/* Handle circle */}
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center rounded-full"
                style={{
                  width: '38px',
                  height: '38px',
                  background: '#fff',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.55)',
                  border: '2.5px solid rgba(0,0,0,0.08)',
                }}
              >
                <ArrowLeftRight size={15} style={{ color: '#111' }} />
              </div>
            </div>
          </>
        )}

        {/* Single-image overlay when no edits applied yet */}
        {!hasAfter && beforeUrl && (
          <div
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ pointerEvents: 'none' }}
          >
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.65)', color: 'var(--text-muted)', backdropFilter: 'blur(6px)' }}
            >
              {t('compare_no_edits')}
            </div>
          </div>
        )}
      </div>

      {/* Drag hint */}
      {hasAfter && (
        <p
          className="text-center font-bold tracking-[0.18em] uppercase"
          style={{ fontSize: '10px', color: 'var(--text-muted)', opacity: 0.55 }}
        >
          {t('compare_hint')}
        </p>
      )}
    </div>
  );
}