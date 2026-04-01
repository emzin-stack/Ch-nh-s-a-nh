'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/Button';
import { Crop, RotateCcw } from 'lucide-react';
import { CropArea, AspectRatio } from '@/types';
import { useI18n } from '@/lib/i18n'; // ← NEW

interface Props {
  imageUrl: string | null;
  onCropComplete: (area: CropArea) => void;
  onApply: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

interface CropperArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function CropTool({ imageUrl, onCropComplete, onApply, onReset, isProcessing }: Props) {
  const { t } = useI18n(); // ← NEW
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('free');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropperArea | null>(null);

  // ← ratios now use t() for the 'Free' label — defined inside component
  const ratios: { label: string; value: AspectRatio; numeric: number | undefined }[] = [
    { label: '1:1',         value: '1:1',   numeric: 1 },
    { label: '16:9',        value: '16:9',  numeric: 16 / 9 },
    { label: '9:16',        value: '9:16',  numeric: 9 / 16 },
    { label: t('crop_free'), value: 'free',  numeric: undefined }, // ← t()
  ];

  const handleCropComplete = useCallback(
    (_: unknown, areaPixels: CropperArea) => {
      setCroppedAreaPixels(areaPixels);
      onCropComplete({
        x: Math.round(areaPixels.x),
        y: Math.round(areaPixels.y),
        width: Math.round(areaPixels.width),
        height: Math.round(areaPixels.height),
      });
    },
    [onCropComplete]
  );

  const handleRatioChange = (ratio: AspectRatio) => {
    setSelectedRatio(ratio);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleApply = () => {
    if (croppedAreaPixels) onApply();
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    onReset();
  };

  const currentRatio = ratios.find((r) => r.value === selectedRatio);

  if (!imageUrl) {
    return (
      <div
        className="flex items-center justify-center rounded-xl p-8 text-sm"
        style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
      >
        {t('crop_upload_prompt')} {/* ← t() */}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Aspect ratio selector */}
      <div>
        <p className="text-xs font-medium mb-2.5" style={{ color: 'var(--text-muted)' }}>{t('crop_ratio')}</p> {/* ← t() */}
        <div className="grid grid-cols-4 gap-2">
          {ratios.map((r) => (
            <button
              key={r.value}
              onClick={() => handleRatioChange(r.value)}
              className="py-2 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: selectedRatio === r.value ? 'rgba(34,211,238,0.15)' : 'var(--surface-3)',
                border: `1px solid ${selectedRatio === r.value ? 'rgba(34,211,238,0.4)' : 'transparent'}`,
                color: selectedRatio === r.value ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop canvas */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{ height: '300px', background: '#000' }}
      >
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={currentRatio?.numeric}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
          style={{
            containerStyle: { borderRadius: '12px' },
          }}
        />
      </div>

      {/* Zoom slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>{t('crop_zoom')}</p> {/* ← t() */}
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{zoom.toFixed(1)}×</span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, var(--accent) 0%, var(--accent) ${((zoom - 1) / 2) * 100}%, var(--surface-3) ${((zoom - 1) / 2) * 100}%, var(--surface-3) 100%)`,
          }}
        />
      </div>

      {/* Crop info */}
      {croppedAreaPixels && (
        <div
          className="px-3 py-2 rounded-lg text-xs font-mono"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px
        </div>
      )}

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={<RotateCcw size={13} />}
          onClick={handleReset}
          className="flex-1"
        >
          {t('crop_reset')} {/* ← t() */}
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={<Crop size={13} />}
          onClick={handleApply}
          loading={isProcessing}
          disabled={!croppedAreaPixels}
          className="flex-1"
        >
          {t('crop_apply')} {/* ← t() */}
        </Button>
      </div>
    </div>
  );
}