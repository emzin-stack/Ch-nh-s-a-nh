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

  // ── 1. TRẠNG THÁI: CHƯA CÓ ẢNH (EMPTY STATE) ──────────────────────────────
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

  // ── 2. TRẠNG THÁI: CHỈ CÓ 1 ẢNH (SINGLE IMAGE) ─────────────────────────────
  if (!hasAfter) {
    return (
      <div className="w-full flex flex-col items-center gap-4">
        {/* Khung ảnh đơn */}
        <div
          className="w-full relative rounded-2xl overflow-hidden checkerboard"
          style={{
            background: '#0a0d14',
            border: '1px solid rgba(255,255,255,0.08)',
            minHeight: '320px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <img
            src={beforeUrl}
            alt={t('compare_before')}
            draggable={false}
            className="max-w-full max-h-[520px] object-contain"
          />
          
          {/* Overlay nhắc nhở áp dụng chỉnh sửa */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-[11px] font-medium"
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'var(--text-muted)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {t('compare_no_edits')}
          </div>
        </div>

        {/* Thông tin dung lượng dưới ảnh */}
        {originalSize != null && (
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
              {t('compare_before')}
            </span>
            <span className="text-[12px] font-mono font-medium" style={{ color: 'var(--text)' }}>
              {formatBytes(originalSize)}
            </span>
          </div>
        )}
      </div>
    );
  }

  // ── 3. TRẠNG THÁI: SO SÁNH (BEFORE & AFTER) ───────────────────────────────
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Khung ảnh chính chia đôi */}
      <div
        className="w-full relative rounded-2xl overflow-hidden checkerboard"
        style={{
          background: '#0a0d14',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr', // Cấu trúc 2 cột + 1 vạch ngăn
          minHeight: '320px',
        }}
      >
        {/* PHẦN TRÁI: ẢNH GỐC */}
        <div className="relative flex items-center justify-center p-4">
          <img
            src={beforeUrl}
            alt={t('compare_before')}
            draggable={false}
            style={{
              maxWidth: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* VẠCH NGĂN GIỮA & NÚT VS */}
        <div style={{ background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
          <div
            className="absolute flex items-center justify-center rounded-full text-[9px] font-black z-20"
            style={{
              width: '30px',
              height: '30px',
              background: '#1a1d24',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--text-muted)',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(0,0,0,0.6)'
            }}
          >
            VS
          </div>
        </div>

        {/* PHẦN PHẢI: ẢNH ĐÃ SỬA */}
        <div className="relative flex items-center justify-center p-4">
          <img
            src={afterUrl}
            alt={t('compare_after')}
            draggable={false}
            style={{
              maxWidth: '100%',
              maxHeight: '500px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      {/* DÒNG THÔNG TIN DƯỚI ẢNH: CĂN GIỮA HOÀN HẢO THEO TRỤC ẢNH */}
      <div 
        className="grid items-start" 
        style={{ gridTemplateColumns: '1fr 1px 1fr' }} // Khớp chính xác với grid ảnh bên trên
      >
        {/* Nhãn & Dung lượng bên trái */}
        <div className="flex flex-col items-center gap-1 text-center">
          <span 
            className="text-[10px] font-bold uppercase tracking-[0.15em]" 
            style={{ color: 'var(--text-muted)' }}
          >
            {t('compare_before')}
          </span>
          {originalSize != null && (
            <span className="text-[12px] font-mono opacity-80" style={{ color: 'var(--text)' }}>
              {formatBytes(originalSize)}
            </span>
          )}
        </div>

        {/* Cột trống (tương ứng với vạch ngăn bên trên) */}
        <div />

        {/* Nhãn & Dung lượng bên phải */}
        <div className="flex flex-col items-center gap-1 text-center">
          <span 
            className="text-[10px] font-bold uppercase tracking-[0.15em]" 
            style={{ color: 'var(--accent)' }}
          >
            {t('compare_after')}
          </span>
          {editedSize != null && (
            <span className="text-[12px] font-mono font-semibold" style={{ color: 'var(--accent)' }}>
              {formatBytes(editedSize)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}