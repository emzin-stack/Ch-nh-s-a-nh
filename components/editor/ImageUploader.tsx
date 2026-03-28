'use client';

import { useCallback, useState } from 'react';
import { UploadCloud, RefreshCcw, FileImage } from 'lucide-react';
import { formatBytes } from '@/lib/imageProcessing';

interface Props {
  onFileSelect: (file: File) => Promise<boolean>;
  hasImage: boolean;
  originalSize: number;
  filename: string;
}

export function ImageUploader({ onFileSelect, hasImage, originalSize, filename }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const processFile = useCallback(
    async (file: File) => {
      setIsUploading(true);
      await onFileSelect(file);
      setIsUploading(false);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      e.target.value = '';
    },
    [processFile]
  );

  if (hasImage) {
    return (
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--accent)' }}
          >
            <FileImage size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text)', maxWidth: '180px' }}>
              {filename}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatBytes(originalSize)}
            </p>
          </div>
        </div>
        <label className="cursor-pointer shrink-0">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleInputChange}
          />
          <span
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{
              background: 'var(--surface-3)',
              border: '1px solid var(--border-md)',
              color: 'var(--text-muted)',
            }}
          >
            <RefreshCcw size={12} />
            Replace
          </span>
        </label>
      </div>
    );
  }

  return (
    <label
      className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl p-10 cursor-pointer transition-all duration-200 ${isDragging ? 'drag-over' : ''}`}
      style={{
        background: isDragging ? 'rgba(34,211,238,0.04)' : 'var(--surface-1)',
        border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border-md)'}`,
        minHeight: '220px',
      }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleInputChange}
        disabled={isUploading}
      />

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200"
        style={{
          background: isDragging ? 'rgba(34,211,238,0.15)' : 'var(--surface-2)',
          color: isDragging ? 'var(--accent)' : 'var(--text-muted)',
        }}
      >
        {isUploading ? (
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <UploadCloud size={24} />
        )}
      </div>

      <div className="text-center">
        <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>
          {isUploading ? 'Loading…' : 'Drop image here or click to upload'}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
          JPG, PNG, GIF, WebP · Max 20 MB
        </p>
      </div>
    </label>
  );
}