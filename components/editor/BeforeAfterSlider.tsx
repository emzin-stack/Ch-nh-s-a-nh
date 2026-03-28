'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowLeftRight } from 'lucide-react';

interface Props {
  beforeUrl: string | null;
  afterUrl: string | null;
}

export function BeforeAfterSlider({ beforeUrl, afterUrl }: Props) {
  const [sliderX, setSliderX] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setSliderX(pct);
  }, []);

  // Xử lý kéo thả mượt mà trên toàn màn hình
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

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  // Giao diện khi chưa có ảnh
  if (!beforeUrl && !afterUrl) {
    return (
      <div className="mx-auto max-w-[500px] w-full flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center border border-dashed border-gray-600 bg-white/5" style={{ minHeight: '240px' }}>
         <ArrowLeftRight size={24} className="text-gray-400 opacity-50" />
         <p className="text-sm text-gray-400">No images to compare</p>
      </div>
    );
  }

  const hasAfter = !!afterUrl && afterUrl !== beforeUrl;

  return (
    <div className="mx-auto max-w-[700px] w-full space-y-4 p-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl select-none cursor-col-resize shadow-2xl border border-white/10"
        style={{
          aspectRatio: '16/9',
          background: '#0a0a0a',
          touchAction: 'none',
        }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={handleTouchMove}
      >
        {/* LỚP DƯỚI: AFTER IMAGE (Full width) */}
        {afterUrl && (
          <img
            src={afterUrl}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        )}

        {/* LỚP TRÊN: BEFORE IMAGE (Bị cắt bởi clipPath) */}
        {beforeUrl && (
          <img
            src={beforeUrl}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ 
              clipPath: `inset(0 ${100 - sliderX}% 0 0)`,
              zIndex: 5
            }}
            draggable={false}
          />
        )}

        {/* CÁC NHÃN (LABELS) - ĐÃ ĐẢO VỊ TRÍ THEO Ý BẠN */}
        {hasAfter && (
          <>
            {/* AFTER label - Ở bên TRÁI */}
            <div
              className="absolute z-20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest pointer-events-none"
              style={{ 
                top: '16px', 
                left: '16px', 
                background: 'rgba(6, 182, 212, 0.7)', // Màu Cyan cho ảnh mới
                color: '#fff',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              AFTER
            </div>

            {/* BEFORE label - Ở bên PHẢI */}
            <div
              className="absolute z-20 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest pointer-events-none"
              style={{ 
                top: '16px', 
                right: '16px', 
                background: 'rgba(0,0,0,0.6)', // Nền đen cho ảnh gốc
                color: '#fff',
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              BEFORE
            </div>

            {/* THANH TRƯỢT VÀ NÚT KÉO */}
            <div
              className="absolute top-0 bottom-0 w-0.5 z-10 bg-white"
              style={{ left: `${sliderX}%`, boxShadow: '0 0 15px rgba(0,0,0,0.5)' }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-2xl border-[3px] border-black/10">
                <ArrowLeftRight size={16} className="text-black" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* CHỮ HƯỚNG DẪN */}
      {hasAfter && (
        <p className="text-[10px] text-center text-gray-500 font-bold tracking-[0.2em] uppercase opacity-60">
          ← Drag to compare →
        </p>
      )}
    </div>
  );
}