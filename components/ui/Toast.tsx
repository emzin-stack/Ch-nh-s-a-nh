'use client';

import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '@/types';

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={15} className="shrink-0" style={{ color: '#34d399' }} />,
  error:   <XCircle    size={15} className="shrink-0" style={{ color: '#f43f5e' }} />,
  info:    <Info       size={15} className="shrink-0" style={{ color: 'var(--accent)' }} />,
};

const borders = {
  success: 'rgba(52,211,153,0.3)',
  error:   'rgba(244,63,94,0.3)',
  info:    'rgba(34,211,238,0.3)',
};

export function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

function Toast({ toast, onRemove }: { toast: ToastMessage; onRemove: (id: string) => void }) {
  return (
    <div
      className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm max-w-sm animate-slide-up"
      style={{
        background: 'var(--surface-2)',
        border: `1px solid ${borders[toast.type]}`,
        color: 'var(--text)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      {icons[toast.type]}
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
      >
        <X size={13} />
      </button>
    </div>
  );
}