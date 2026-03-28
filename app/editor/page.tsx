'use client';

import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEditor } from '@/hooks/useEditor';
import { useToast } from '@/hooks/useToast';
import { Navbar } from '@/components/ui/Navbar';
import { ToastContainer } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ImageUploader } from '@/components/editor/ImageUploader';
import { ToolPanel } from '@/components/editor/ToolPanel';
import { CompressionTool } from '@/components/editor/CompressionTool';
import { CropTool } from '@/components/editor/CropTool';
import { FormatConverter } from '@/components/editor/FormatConverter';
import { BeforeAfterSlider } from '@/components/editor/BeforeAfterSlider';
import { saveEditHistory } from '@/lib/uploadToStorage';
import { formatBytes, dataUrlToBlob } from '@/lib/imageProcessing';
import type { CropArea, ImageFormat, EditType } from '@/types';
import {
  Download, Save, RotateCcw, Info, Lock
} from 'lucide-react';
import Link from 'next/link';

export default function EditorPage() {
  const { user } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  const {
    state,
    error,
    setPartial,
    handleFileUpload,
    applyCompression,
    setCropArea,
    applyCrop,
    applyFormatConversion,
    downloadEdited,
    reset,
    resetEdits,
    setError,
  } = useEditor();

  // ─── File upload ──────────────────────────────────────────────────────────

  const onFileSelect = useCallback(
    async (file: File) => {
      const ok = await handleFileUpload(file);
      if (!ok) {
        addToast('error', 'Invalid file. Please upload a JPG, PNG, GIF, or WebP under 20 MB.');
      } else {
        addToast('info', `Loaded: ${file.name}`);
      }
      return ok;
    },
    [handleFileUpload, addToast]
  );

  // ─── Apply tools ──────────────────────────────────────────────────────────

  const handleApplyCompression = async () => {
    await applyCompression();
    addToast('success', 'Compression applied!');
  };

  const handleApplyCrop = async () => {
    await applyCrop();
    addToast('success', 'Crop applied!');
  };

  const handleApplyFormat = async () => {
    await applyFormatConversion();
    addToast('success', `Converted to .${state.outputFormat}!`);
  };

  // ─── Download ─────────────────────────────────────────────────────────────

  const handleDownload = () => {
    if (!state.editedDataUrl) {
      addToast('error', 'No edited image to download.');
      return;
    }
    downloadEdited();
    addToast('success', 'Download started!');
  };

  // ─── Save to history ──────────────────────────────────────────────────────

  const handleSaveToHistory = async () => {
    if (!user) {
      addToast('info', 'Sign in to save your edit history.');
      return;
    }
    if (!state.originalFile || !state.editedDataUrl || !state.originalDataUrl) {
      addToast('error', 'Nothing to save yet.');
      return;
    }

    setPartial({ isProcessing: true });

    try {
      const originalBlob = state.originalFile;
      const editedBlob = dataUrlToBlob(state.editedDataUrl);

      // Determine edit type
      let editType: EditType = 'combined';
      if (state.activeTool === 'compress') editType = 'compression';
      else if (state.activeTool === 'crop') editType = 'crop';
      else if (state.activeTool === 'format') editType = 'format';

      await saveEditHistory({
        userId: user.id,
        originalBlob,
        editedBlob,
        editType,
        format: state.outputFormat,
        originalSize: state.originalSize,
        editedSize: state.editedSize,
        originalFilename: state.originalFile.name,
        metadata: {
          compressionQuality: state.compressionQuality,
          hasCrop: !!state.cropArea,
        },
      });

      addToast('success', 'Saved to history!');
    } catch (e) {
      console.error(e);
      addToast('error', 'Failed to save history. Check Supabase storage settings.');
    } finally {
      setPartial({ isProcessing: false });
    }
  };

  const hasImage = !!state.originalDataUrl;
  const hasEdits = !!state.editedDataUrl && state.editedDataUrl !== state.originalDataUrl;

  const currentTool = state.activeTool;
  const origExt = state.originalFile
    ? (state.originalFile.type.split('/')[1] as ImageFormat) ?? 'jpg'
    : 'jpg';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Error banner */}
      {error && (
        <div
          className="mx-4 mt-3 px-4 py-3 rounded-xl flex items-center gap-3 text-sm"
          style={{
            background: 'rgba(244,63,94,0.1)',
            border: '1px solid rgba(244,63,94,0.3)',
            color: '#f43f5e',
          }}
        >
          <Info size={15} className="shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <main className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">

        {/* ── LEFT PANEL: Upload + Tools ───────────────────────────────────── */}
        <aside
          className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-4 p-4 overflow-y-auto"
          style={{
            borderRight: '1px solid var(--border)',
            maxHeight: 'calc(100vh - 56px)',
          }}
        >
          {/* Upload */}
          <section>
            <p className="text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Image
            </p>
            <ImageUploader
              onFileSelect={onFileSelect}
              hasImage={hasImage}
              originalSize={state.originalSize}
              filename={state.originalFile?.name ?? ''}
            />
          </section>

          {/* Tools */}
          {hasImage && (
            <section>
              <p className="text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                Tools
              </p>
              <ToolPanel
                activeTool={state.activeTool}
                onToolChange={(t) => setPartial({ activeTool: t })}
              >
                {currentTool === 'compress' && (
                  <CompressionTool
                    quality={state.compressionQuality}
                    onQualityChange={(q) => setPartial({ compressionQuality: q })}
                    onApply={handleApplyCompression}
                    isProcessing={state.isProcessing}
                    originalSize={state.originalSize}
                    editedSize={state.editedSize}
                  />
                )}
                {currentTool === 'crop' && (
                  <CropTool
                    imageUrl={state.originalDataUrl}
                    onCropComplete={(area: CropArea) => setCropArea(area)}
                    onApply={handleApplyCrop}
                    onReset={resetEdits}
                    isProcessing={state.isProcessing}
                  />
                )}
                {currentTool === 'format' && (
                  <FormatConverter
                    currentFormat={origExt === 'jpeg' ? 'jpg' : origExt}
                    outputFormat={state.outputFormat}
                    onFormatChange={(f: ImageFormat) => setPartial({ outputFormat: f })}
                    onApply={handleApplyFormat}
                    isProcessing={state.isProcessing}
                    hasImage={hasImage}
                  />
                )}
              </ToolPanel>
            </section>
          )}

          {/* Actions */}
          {hasImage && (
            <section className="space-y-2">
              <p className="text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
                Actions
              </p>

              <Button
                variant="primary"
                className="w-full"
                icon={<Download size={14} />}
                onClick={handleDownload}
                disabled={!hasEdits && !hasImage}
              >
                Download Edited
              </Button>

              {user ? (
                <Button
                  variant="secondary"
                  className="w-full"
                  icon={<Save size={14} />}
                  onClick={handleSaveToHistory}
                  loading={state.isProcessing}
                  disabled={!hasEdits}
                >
                  Save to History
                </Button>
              ) : (
                <Link href="/login" className="block">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border-md)',
                      color: 'var(--text-muted)',
                    }}
                  >
                    <Lock size={13} />
                    Sign in to save history
                  </button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                icon={<RotateCcw size={13} />}
                onClick={resetEdits}
              >
                Reset Edits
              </Button>
            </section>
          )}
        </aside>

        {/* ── CENTER: Image Preview ────────────────────────────────────────── */}
        <section className="flex-1 flex flex-col p-4 gap-3 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              Preview
            </p>
            {hasImage && (
              <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                <span>
                  Original: <span style={{ color: 'var(--text)' }}>{formatBytes(state.originalSize)}</span>
                </span>
                {hasEdits && (
                  <>
                    <span>→</span>
                    <span>
                      Edited: <span style={{ color: 'var(--accent)' }}>{formatBytes(state.editedSize)}</span>
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Main preview canvas */}
          <div
            className="flex-1 flex items-center justify-center rounded-2xl overflow-hidden relative"
            style={{
              background: 'var(--surface-1)',
              border: '1px solid var(--border)',
              minHeight: '320px',
            }}
          >
            {/* Checkerboard background for transparency */}
            <div className="absolute inset-0 checkerboard opacity-20 rounded-2xl" />

            {state.isProcessing && (
              <div
                className="absolute inset-0 flex items-center justify-center z-20 rounded-2xl"
                style={{ background: 'rgba(10,13,20,0.75)', backdropFilter: 'blur(4px)' }}
              >
                <LoadingSpinner size={32} label="Processing…" />
              </div>
            )}

            {hasImage ? (
              <img
                src={state.editedDataUrl ?? state.originalDataUrl ?? ''}
                alt="Edited preview"
                className="relative z-10 max-w-full max-h-full object-contain"
                style={{ maxHeight: 'calc(100vh - 280px)' }}
              />
            ) : (
              <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'var(--surface-2)', color: 'var(--text-muted)' }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: 'var(--text)' }}>
                    No image loaded
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Upload an image using the panel on the left
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── RIGHT PANEL: Before / After ──────────────────────────────────── */}
        <aside
          className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col p-4 gap-3 overflow-y-auto"
          style={{
            borderLeft: '1px solid var(--border)',
            maxHeight: 'calc(100vh - 56px)',
          }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Before / After
          </p>

          <BeforeAfterSlider
            beforeUrl={state.originalDataUrl}
            afterUrl={hasEdits ? state.editedDataUrl : null}
          />

          {/* Size comparison */}
          {hasEdits && (
            <div
              className="p-3 rounded-xl space-y-2"
              style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
            >
              <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>SIZE COMPARISON</p>
              <div className="space-y-1.5">
                {/* Original bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                    <span>Original</span>
                    <span>{formatBytes(state.originalSize)}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--surface-3)' }}>
                    <div className="h-full rounded-full" style={{ width: '100%', background: 'var(--surface-4)' }} />
                  </div>
                </div>
                {/* Edited bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: 'var(--text-muted)' }}>Edited</span>
                    <span style={{ color: 'var(--accent)' }}>{formatBytes(state.editedSize)}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'var(--surface-3)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (state.editedSize / state.originalSize) * 100)}%`,
                        background: 'linear-gradient(90deg, #22d3ee, #0ea5e9)',
                      }}
                    />
                  </div>
                </div>
              </div>
              {state.editedSize < state.originalSize && (
                <p className="text-xs text-right" style={{ color: '#34d399' }}>
                  ↓ {Math.round((1 - state.editedSize / state.originalSize) * 100)}% smaller
                </p>
              )}
            </div>
          )}

          {/* Guest nudge */}
          {!user && hasEdits && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                background: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.2)',
                color: 'var(--text-muted)',
              }}
            >
              <p className="font-medium mb-1" style={{ color: '#a78bfa' }}>Save your work</p>
              <p className="text-xs">
                <Link href="/register" style={{ color: 'var(--accent)' }} className="hover:underline">
                  Create a free account
                </Link>{' '}
                to save and re-access your edits.
              </p>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}