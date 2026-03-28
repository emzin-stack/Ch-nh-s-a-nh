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

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => { if (isDragging) updateSlider(e.clientX); };
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

  if (!beforeUrl && !afterUrl) {
    return (
      <div className="mx-auto max-w-[500px] w-full flex flex-col items-center justify-center gap-3 rounded-2xl p-8 text-center border border-dashed border-gray-600 bg-black/5" style={{ minHeight: '200px' }}>
         <ArrowLeftRight size={20} className="text-gray-400" />
         <p className="text-xs text-gray-500">Chưa có ảnh để so sánh</p>
      </div>
    );
  }

  const hasAfter = !!afterUrl && afterUrl !== beforeUrl;

  return (
    /* 1. Thêm max-w-[600px] và mx-auto để thu nhỏ và căn giữa toàn bộ component */
    <div className="mx-auto max-w-[600px] w-full space-y-3 p-2">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl select-none cursor-col-resize shadow-lg"
        style={{
          /* 2. Giảm tỉ lệ chiều cao xuống (16/9 sẽ dẹt và gọn hơn 4/3) */
          aspectRatio: '16/9', 
          background: '#111',
          border: '1px solid rgba(255,255,255,0.1)',
          touchAction: 'none',
        }}
        onMouseDown={() => setIsDragging(true)}
        onTouchStart={() => setIsDragging(true)}
        onTouchMove={handleTouchMove}
      >
        {/* AFTER IMAGE */}
        {afterUrl && (
          <img
            src={afterUrl}
            alt="After"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            draggable={false}
          />
        )}

        {/* BEFORE IMAGE (Clipped) */}
        {beforeUrl && (
          <img
            src={beforeUrl}
            alt="Before"
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ clipPath: `inset(0 ${100 - sliderX}% 0 0)` }}
            draggable={false}
          />
        )}

        {/* Slider Handle */}
        {hasAfter && (
          <>
            <div
              className="absolute top-0 bottom-0 w-0.5 z-10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
              style={{ left: `${sliderX}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xl border border-gray-200">
                <ArrowLeftRight size={12} className="text-black" />
              </div>
            </div>

            {/* Labels - Thu nhỏ font chữ */}
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/40 text-white backdrop-blur-sm">
              Trước
            </div>
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-cyan-500/60 text-white backdrop-blur-sm">
              Sau
            </div>
          </>
        )}
      </div>

      {hasAfter && (
        <p className="text-[10px] text-center text-gray-400 font-medium">
          ← Kéo thanh trắng để xem sự thay đổi →
        </p>
      )}
    </div>
  );
}