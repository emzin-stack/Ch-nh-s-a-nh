'use client';

import { Zap, Crop, RefreshCw } from 'lucide-react';
import { ActiveTool } from '@/types';

interface Props {
  activeTool: ActiveTool;
  onToolChange: (t: ActiveTool) => void;
  children: React.ReactNode;
}

const tools: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
  { id: 'compress', label: 'Compress',  icon: <Zap size={15} /> },
  { id: 'crop',     label: 'Crop',      icon: <Crop size={15} /> },
  { id: 'format',   label: 'Convert',   icon: <RefreshCw size={15} /> },
];

export function ToolPanel({ activeTool, onToolChange, children }: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Tool tabs */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        {tools.map((t) => (
          <button
            key={t.id}
            onClick={() => onToolChange(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              background: activeTool === t.id ? 'var(--surface-4)' : 'transparent',
              color: activeTool === t.id ? 'var(--text)' : 'var(--text-muted)',
              border: activeTool === t.id ? '1px solid var(--border-md)' : '1px solid transparent',
            }}
          >
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tool content */}
      <div
        className="p-4 rounded-2xl"
        style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
      >
        {children}
      </div>
    </div>
  );
}