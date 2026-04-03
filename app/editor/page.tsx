'use client';

/**
 * MODIFIED FILE: app/editor/page.tsx
 *
 * Layout change:
 *   - Removed the center "Preview" section entirely (was redundant with compare panel)
 *   - Layout is now two-column: LEFT = controls sidebar, RIGHT = before/after fills flex-1
 *   - BeforeAfterSlider now receives originalSize + editedSize for KB badges
 *   - Processing overlay now lives inside the compare area, not a separate canvas
 */

import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useEditor } from '@/hooks/useEditor';
import { useToast } from '@/hooks/useToast';
import { useI18n } from '@/lib/i18n';
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
import { Download, Save, RotateCcw, Info, Lock } from 'lucide-react';
import Link from 'next/link';

export default function EditorPage() {
  const { user } = useAuth();
  const { toasts, addToast, removeToast } = useToast();
  const { t } = useI18n();

  const {
    state, error, setPartial, handleFileUpload,
    applyCompression, setCropArea, applyCrop,
    applyFormatConversion, downloadEdited, resetEdits, setError,
  } = useEditor();

  // ── File upload ────────────────────────────────────────────────────────────
  const onFileSelect = useCallback(
    async (file: File) => {
      const ok = await handleFileUpload(file);
      if (!ok) addToast('error', t('editor_toast_invalid'));
      else      addToast('info',  t('editor_toast_loaded', { name: file.name }));
      return ok;
    },
    [handleFileUpload, addToast, t]
  );

  // ── Tools ──────────────────────────────────────────────────────────────────
  const handleApplyCompression = async () => {
    await applyCompression();
    addToast('success', t('editor_toast_compressed'));
  };

  const handleApplyCrop = async () => {
    await applyCrop();
    addToast('success', t('editor_toast_cropped'));
  };

  const handleApplyFormat = async () => {
    await applyFormatConversion();
    addToast('success', t('editor_toast_converted', { format: state.outputFormat }));
  };

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!state.editedDataUrl) { addToast('error', t('editor_toast_no_image')); return; }
    downloadEdited();
    addToast('success', t('editor_toast_downloaded'));
  };

  // ── Save to history ────────────────────────────────────────────────────────
  const handleSaveToHistory = async () => {
    if (!user) { addToast('info', t('editor_toast_signin')); return; }
    if (!state.originalFile || !state.editedDataUrl || !state.originalDataUrl) {
      addToast('error', t('editor_toast_nothing')); return;
    }
    setPartial({ isProcessing: true });
    try {
      const originalBlob = state.originalFile;
      const editedBlob   = dataUrlToBlob(state.editedDataUrl);
      let editType: EditType = 'combined';
      if (state.activeTool === 'compress') editType = 'compression';
      else if (state.activeTool === 'crop')   editType = 'crop';
      else if (state.activeTool === 'format') editType = 'format';

      await saveEditHistory({
        userId: user.id, originalBlob, editedBlob, editType,
        format: state.outputFormat,
        originalSize: state.originalSize, editedSize: state.editedSize,
        originalFilename: state.originalFile.name,
        metadata: { compressionQuality: state.compressionQuality, hasCrop: !!state.cropArea },
      });
      addToast('success', t('editor_toast_saved'));
    } catch (e) {
      console.error(e);
      addToast('error', t('editor_toast_save_fail'));
    } finally {
      setPartial({ isProcessing: false });
    }
  };

  const hasImage  = !!state.originalDataUrl;
  const hasEdits  = !!state.editedDataUrl && state.editedDataUrl !== state.originalDataUrl;
  const currentTool = state.activeTool;
  const origExt   = state.originalFile
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
          style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e' }}
        >
          <Info size={15} className="shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/*
        Two-column layout:
          LEFT  — fixed-width controls sidebar
          RIGHT — flex-1 comparison area (fills all remaining width)
        On mobile both stack vertically.
      */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">

        {/* ── LEFT: Controls ─────────────────────────────────────────────── */}
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
              {t('editor_section_image')}
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
                {t('editor_section_tools')}
              </p>
              <ToolPanel
                activeTool={state.activeTool}
                onToolChange={(tool) => setPartial({ activeTool: tool })}
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
                {t('editor_section_actions')}
              </p>

              <Button
                variant="primary"
                className="w-full"
                icon={<Download size={14} />}
                onClick={handleDownload}
                disabled={!hasImage}
              >
                {t('editor_btn_download')}
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
                  {t('editor_btn_save')}
                </Button>
              ) : (
                <Link href="/login" className="block">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-80"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border-md)', color: 'var(--text-muted)' }}
                  >
                    <Lock size={13} />
                    {t('editor_btn_signin_save')}
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
                {t('editor_btn_reset')}
              </Button>
            </section>
          )}

          {/* Size comparison — only when edits exist */}
          {hasEdits && (
            <section>
              <div
                className="p-3 rounded-xl space-y-2"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
              >
                <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  {t('editor_size_comparison')}
                </p>
                <div className="space-y-1.5">
                  {/* Original bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                      <span>{t('editor_original')}</span>
                      <span>{formatBytes(state.originalSize)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-3)' }}>
                      <div className="h-full rounded-full" style={{ width: '100%', background: 'var(--surface-4)' }} />
                    </div>
                  </div>
                  {/* Edited bar */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: 'var(--text-muted)' }}>{t('editor_edited')}</span>
                      <span style={{ color: 'var(--accent)' }}>{formatBytes(state.editedSize)}</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--surface-3)' }}>
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
                    {t('editor_smaller', { pct: Math.round((1 - state.editedSize / state.originalSize) * 100) })}
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Guest nudge */}
          {!user && hasEdits && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', color: 'var(--text-muted)' }}
            >
              <p className="font-medium mb-1" style={{ color: '#a78bfa' }}>{t('editor_guest_title')}</p>
              <p className="text-xs">
                <Link href="/register" style={{ color: 'var(--accent)' }} className="hover:underline">
                  {t('editor_guest_link')}
                </Link>{' '}
                {t('editor_guest_body')}
              </p>
            </div>
          )}
        </aside>

        {/* ── RIGHT: Before / After comparison — fills all remaining space ── */}
        <section className="flex-1 flex flex-col p-5 gap-4 overflow-y-auto min-w-0">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
              {t('editor_section_compare')}
            </p>
            {hasImage && (
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {t('editor_original')}: <span style={{ color: 'var(--text)' }}>{formatBytes(state.originalSize)}</span>
                {hasEdits && (
                  <>
                    {' → '}
                    {t('editor_edited')}: <span style={{ color: 'var(--accent)' }}>{formatBytes(state.editedSize)}</span>
                  </>
                )}
              </span>
            )}
          </div>

          {/* Processing overlay wraps only the compare area */}
          <div className="relative flex-1">
            {state.isProcessing && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl"
                style={{ background: 'rgba(10,13,20,0.75)', backdropFilter: 'blur(4px)' }}
              >
                <LoadingSpinner size={32} label={t('editor_processing')} />
              </div>
            )}

            {/*
              Pass originalSize + editedSize so the ImagePanel badges show KB values.
              The component itself decides whether to show one full-width image or
              two side-by-side panels depending on hasAfter.
            */}
            <BeforeAfterSlider
              beforeUrl={state.originalDataUrl}
              afterUrl={hasEdits ? state.editedDataUrl : null}
              originalSize={state.originalSize}
              editedSize={hasEdits ? state.editedSize : undefined}
            />
          </div>
        </section>
      </main>
    </div>
  );
}