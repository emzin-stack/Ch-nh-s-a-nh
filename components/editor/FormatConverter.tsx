'use client';

import { Button } from '@/components/ui/Button';
import { ImageFormat } from '@/types';
import { RefreshCw } from 'lucide-react';

interface Props {
  currentFormat: ImageFormat;
  outputFormat: ImageFormat;
  onFormatChange: (f: ImageFormat) => void;
  onApply: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

const formats: { value: ImageFormat; label: string; desc: string; supports: string }[] = [
  { value: 'jpg',  label: 'JPG',  desc: 'Best for photos', supports: 'No transparency' },
  { value: 'png',  label: 'PNG',  desc: 'Lossless quality', supports: 'Transparency ✓' },
  { value: 'webp', label: 'WebP', desc: 'Modern & efficient', supports: 'Transparency ✓' },
  { value: 'gif',  label: 'GIF',  desc: 'Animated images', supports: 'Limited colors' },
];

export function FormatConverter({ currentFormat, outputFormat, onFormatChange, onApply, isProcessing, hasImage }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-medium mb-2.5" style={{ color: 'var(--text-muted)' }}>OUTPUT FORMAT</p>
        <div className="grid grid-cols-2 gap-2">
          {formats.map((f) => {
            const isSelected = outputFormat === f.value;
            return (
              <button
                key={f.value}
                onClick={() => onFormatChange(f.value)}
                className="p-3 rounded-xl text-left transition-all duration-150"
                style={{
                  background: isSelected ? 'rgba(34,211,238,0.1)' : 'var(--surface-2)',
                  border: `1px solid ${isSelected ? 'rgba(34,211,238,0.4)' : 'var(--border)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-bold font-mono"
                    style={{
                      background: isSelected ? 'rgba(34,211,238,0.2)' : 'var(--surface-3)',
                      color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                    }}
                  >
                    .{f.value}
                  </span>
                </div>
                <p className="text-xs font-medium" style={{ color: isSelected ? 'var(--text)' : 'var(--text-muted)' }}>
                  {f.desc}
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
                  {f.supports}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversion info */}
      {currentFormat && (
        <div
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs"
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <span
            className="px-1.5 py-0.5 rounded font-mono font-bold"
            style={{ background: 'var(--surface-3)', color: 'var(--text)' }}
          >
            .{currentFormat}
          </span>
          <span>→</span>
          <span
            className="px-1.5 py-0.5 rounded font-mono font-bold"
            style={{ background: 'rgba(34,211,238,0.15)', color: 'var(--accent)' }}
          >
            .{outputFormat}
          </span>
          {(outputFormat === 'jpg' || outputFormat === 'jpeg') && (
            <span className="ml-auto text-xs" style={{ color: '#fbbf24', fontSize: '10px' }}>
              ⚠ Transparency will become white
            </span>
          )}
        </div>
      )}

      <Button
        variant="primary"
        className="w-full"
        icon={<RefreshCw size={14} />}
        onClick={onApply}
        loading={isProcessing}
        disabled={!hasImage}
      >
        Convert Format
      </Button>
    </div>
  );
}