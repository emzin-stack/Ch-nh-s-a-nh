'use client';

/**
 * MODIFIED FILE: components/editor/ToolPanel.tsx
 *
 * Changes vs original:
 *   1. import useI18n
 *   2. const { t } = useI18n() inside component
 *   3. tools array moved inside component (needs t())
 *   4. Replace: 'Compress', 'Crop', 'Convert' tab labels
 */

import { Zap, Crop, RefreshCw } from 'lucide-react';
import { ActiveTool } from '@/types';
import { useI18n } from '@/lib/i18n'; // ← NEW

interface Props {
  activeTool: ActiveTool;
  onToolChange: (t: ActiveTool) => void;
  children: React.ReactNode;
}

export function ToolPanel({ activeTool, onToolChange, children }: Props) {
  const { t } = useI18n(); // ← NEW

  // ← moved inside component so t() is available for labels
  const tools: { id: ActiveTool; label: string; icon: React.ReactNode }[] = [
    { id: 'compress', label: t('tool_compress'), icon: <Zap size={15} /> },   // ← t()
    { id: 'crop',     label: t('tool_crop'),     icon: <Crop size={15} /> },  // ← t()
    { id: 'format',   label: t('tool_convert'),  icon: <RefreshCw size={15} /> }, // ← t()
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Tool tabs */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
      >
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolChange(tool.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all duration-150"
            style={{
              background: activeTool === tool.id ? 'var(--surface-4)' : 'transparent',
              color: activeTool === tool.id ? 'var(--text)' : 'var(--text-muted)',
              border: activeTool === tool.id ? '1px solid var(--border-md)' : '1px solid transparent',
            }}
          >
            {tool.icon}
            <span className="hidden sm:inline">{tool.label}</span>
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