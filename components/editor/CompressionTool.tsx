'use client';

import { Button } from '@/components/ui/Button';
import { formatBytes, estimateCompressedSize } from '@/lib/imageProcessing';
import { Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n'; // ← NEW

interface Props {
  quality: number;
  onQualityChange: (q: number) => void;
  onApply: () => void;
  isProcessing: boolean;
  originalSize: number;
  editedSize: number;
}

const presets = [
  { label: 'Max',  value: 95 },
  { label: 'High', value: 80 },
  { label: 'Med',  value: 60 },
  { label: 'Low',  value: 30 },
];

export function CompressionTool({ quality, onQualityChange, onApply, isProcessing, originalSize, editedSize }: Props) {
  const { t } = useI18n(); // ← NEW
  const estimated = estimateCompressedSize(originalSize, quality);
  const reduction = originalSize > 0 ? Math.round((1 - estimated / originalSize) * 100) : 0;

  // ← t() replaces hardcoded quality labels
  const qualityLabel =
    quality >= 85 ? t('compress_excellent') :
    quality >= 70 ? t('compress_good') :
    quality >= 50 ? t('compress_medium') :
    quality >= 30 ? t('compress_low') : t('compress_very_low');

  const qualityColor =
    quality >= 85 ? '#34d399' :
    quality >= 70 ? '#22d3ee' :
    quality >= 50 ? '#fbbf24' :
    '#f43f5e';

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <p className="text-xs font-medium mb-2.5" style={{ color: 'var(--text-muted)' }}>{t('compress_presets')}</p> {/* ← t() */}
        <div className="grid grid-cols-4 gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => onQualityChange(p.value)}
              className="py-2 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: quality === p.value ? 'rgba(34,211,238,0.15)' : 'var(--surface-3)',
                border: `1px solid ${quality === p.value ? 'rgba(34,211,238,0.4)' : 'transparent'}`,
                color: quality === p.value ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{t('compress_quality')}</p> {/* ← t() */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: qualityColor }}>{qualityLabel}</span>
            <span
              className="px-2 py-0.5 rounded text-xs font-mono font-bold"
              style={{ background: 'var(--surface-3)', color: 'var(--text)' }}
            >
              {quality}%
            </span>
          </div>
        </div>
        <input
          type="range"
          min={5}
          max={100}
          step={1}
          value={quality}
          onChange={(e) => onQualityChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${quality}%, var(--surface-3) ${quality}%, var(--surface-3) 100%)`,
          }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('compress_smallest')}</span>   {/* ← t() */}
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{t('compress_highest')}</span>   {/* ← t() */}
        </div>
      </div>

      {/* Size info */}
      <div
        className="grid grid-cols-2 gap-3 p-3 rounded-xl"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('compress_original')}</p>  {/* ← t() */}
          <p className="text-sm font-semibold font-mono" style={{ color: 'var(--text)' }}>
            {formatBytes(originalSize)}
          </p>
        </div>
        <div>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{t('compress_estimated')}</p>  {/* ← t() */}
          <p className="text-sm font-semibold font-mono" style={{ color: 'var(--accent)' }}>
            {formatBytes(estimated)}
          </p>
        </div>
        {reduction > 0 && (
          <div className="col-span-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {t('compress_reduction')}{' '}  {/* ← t() */}
              <span style={{ color: '#34d399', fontWeight: 600 }}>
                {t('compress_smaller', { pct: reduction })}  {/* ← t() with var */}
              </span>
            </p>
          </div>
        )}
      </div>

      <Button
        variant="primary"
        className="w-full"
        icon={<Zap size={14} />}
        onClick={onApply}
        loading={isProcessing}
        disabled={!originalSize}
      >
        {t('compress_apply')} {/* ← t() */}
      </Button>
    </div>
  );
}