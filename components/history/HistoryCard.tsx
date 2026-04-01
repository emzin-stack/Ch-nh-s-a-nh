'use client';

/**
 * MODIFIED FILE: components/history/HistoryCard.tsx
 *
 * Changes vs original:
 *   1. import useI18n
 *   2. const { t } = useI18n() inside component
 *   3. Replace: editTypeLabels values, 'Download', 'Before', 'After'
 */

import { Download, Trash2, Clock } from 'lucide-react';
import { EditHistoryRecord } from '@/types';
import { formatBytes } from '@/lib/imageProcessing';
import { useI18n } from '@/lib/i18n'; // ← NEW

interface Props {
  record: EditHistoryRecord;
  onDelete: (id: string) => void;
}

// ← colour map stays static (no text)
const editTypeColors: Record<string, string> = {
  compression: '#22d3ee',
  crop:        '#a78bfa',
  format:      '#fbbf24',
  combined:    '#34d399',
};

export function HistoryCard({ record, onDelete }: Props) {
  const { t } = useI18n(); // ← NEW

  // ← label map moved inside component so t() is available
  const editTypeLabels: Record<string, string> = {
    compression: t('history_type_compression'), // ← t()
    crop:        t('history_type_crop'),        // ← t()
    format:      t('history_type_format'),      // ← t()
    combined:    t('history_type_combined'),    // ← t()
  };

  const date = new Date(record.created_at);
  const timeAgo = formatTimeAgo(date);

  const downloadEdited = () => {
    const link = document.createElement('a');
    link.href = record.edited_url;
    link.download = `edited_${record.id.slice(0, 8)}.${record.format}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const savings =
    record.original_size && record.edited_size
      ? Math.round((1 - record.edited_size / record.original_size) * 100)
      : null;

  return (
    <div
      className="group rounded-2xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
      style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
    >
      {/* Preview strip */}
      <div className="relative flex" style={{ height: '120px', background: '#000' }}>
        {/* Original */}
        <div className="flex-1 relative overflow-hidden">
          <img src={record.original_url} alt={t('history_before')} className="w-full h-full object-cover opacity-60" />
          <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(0,0,0,0.7)', color: '#aaa' }}>
            {t('history_before')} {/* ← t() */}
          </span>
        </div>
        {/* Divider */}
        <div className="w-px" style={{ background: 'var(--border)' }} />
        {/* Edited */}
        <div className="flex-1 relative overflow-hidden">
          <img src={record.edited_url} alt={t('history_after')} className="w-full h-full object-cover" />
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(34,211,238,0.7)', color: '#000', fontWeight: 600 }}>
            {t('history_after')} {/* ← t() */}
          </span>
        </div>
        {/* Edit type badge */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{
            background: `${editTypeColors[record.edit_type]}22`,
            color: editTypeColors[record.edit_type],
            border: `1px solid ${editTypeColors[record.edit_type]}44`,
          }}
        >
          {editTypeLabels[record.edit_type]}
        </div>
      </div>

      {/* Meta */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
            <Clock size={11} />
            {timeAgo}
          </div>
          <span className="px-1.5 py-0.5 rounded text-xs font-mono font-bold uppercase" style={{ background: 'var(--surface-3)', color: 'var(--text-muted)' }}>
            .{record.format}
          </span>
        </div>

        {/* Size info */}
        {record.original_size && record.edited_size && (
          <div className="flex items-center gap-2 mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{formatBytes(record.original_size)}</span>
            <span>→</span>
            <span style={{ color: 'var(--accent)' }}>{formatBytes(record.edited_size)}</span>
            {savings !== null && savings > 0 && (
              <span className="ml-auto px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(52,211,153,0.1)', color: '#34d399', fontSize: '10px' }}>
                -{savings}%
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={downloadEdited}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(34,211,238,0.1)', color: 'var(--accent)', border: '1px solid rgba(34,211,238,0.2)' }}
          >
            <Download size={12} />
            {t('history_download')} {/* ← t() */}
          </button>
          <button
            onClick={() => onDelete(record.id)}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(244,63,94,0.1)', color: '#f43f5e', border: '1px solid rgba(244,63,94,0.2)' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}