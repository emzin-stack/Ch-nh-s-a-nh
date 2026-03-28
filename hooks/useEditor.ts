'use client';

import { useState, useCallback, useRef } from 'react';
import {
  compressImage,
  cropImage,
  convertFormat,
  fileToDataUrl,
  dataUrlToBlob,
  estimateCompressedSize,
  getFilenameWithoutExt,
} from '@/lib/imageProcessing';
import { CropArea, ImageFormat, ActiveTool, EditorState } from '@/types';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export function useEditor() {
  const [state, setState] = useState<EditorState>({
    originalFile: null,
    originalDataUrl: null,
    editedDataUrl: null,
    outputFormat: 'jpg',
    compressionQuality: 80,
    cropArea: null,
    activeTool: 'compress',
    isProcessing: false,
    originalSize: 0,
    editedSize: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const pendingCropRef = useRef<CropArea | null>(null);

  const setPartial = (partial: Partial<EditorState>) =>
    setState((prev) => ({ ...prev, ...partial }));

  // ─── Upload ────────────────────────────────────────────────────────────────

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Unsupported file type. Please upload JPG, PNG, GIF, or WebP.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum size is 20 MB.');
      return false;
    }

    const dataUrl = await fileToDataUrl(file);
    const ext = file.type.split('/')[1] as ImageFormat;

    setPartial({
      originalFile: file,
      originalDataUrl: dataUrl,
      editedDataUrl: dataUrl,
      outputFormat: ext === 'jpeg' ? 'jpg' : ext,
      originalSize: file.size,
      editedSize: file.size,
      cropArea: null,
    });

    return true;
  }, []);

  // ─── Compress ──────────────────────────────────────────────────────────────

  const applyCompression = useCallback(async () => {
    if (!state.originalFile) return;
    setPartial({ isProcessing: true });
    setError(null);

    try {
      const { dataUrl, size } = await compressImage(
        state.originalFile,
        state.compressionQuality
      );
      setPartial({ editedDataUrl: dataUrl, editedSize: size });
    } catch (e) {
      setError('Compression failed. Please try again.');
      console.error(e);
    } finally {
      setPartial({ isProcessing: false });
    }
  }, [state.originalFile, state.compressionQuality]);

  // ─── Crop ──────────────────────────────────────────────────────────────────

  const setCropArea = useCallback((area: CropArea | null) => {
    pendingCropRef.current = area;
    setPartial({ cropArea: area });
  }, []);

  const applyCrop = useCallback(async () => {
    if (!state.originalDataUrl || !pendingCropRef.current) return;
    setPartial({ isProcessing: true });
    setError(null);

    try {
      const { dataUrl, size } = await cropImage(
        state.originalDataUrl,
        pendingCropRef.current
      );
      setPartial({ editedDataUrl: dataUrl, editedSize: size });
    } catch (e) {
      setError('Crop failed. Please try again.');
      console.error(e);
    } finally {
      setPartial({ isProcessing: false });
    }
  }, [state.originalDataUrl]);

  // ─── Format Conversion ─────────────────────────────────────────────────────

  const applyFormatConversion = useCallback(async () => {
    if (!state.originalDataUrl) return;
    setPartial({ isProcessing: true });
    setError(null);

    try {
      const source = state.editedDataUrl ?? state.originalDataUrl;
      const { dataUrl, size } = await convertFormat(
        source,
        state.outputFormat,
        state.compressionQuality / 100
      );
      setPartial({ editedDataUrl: dataUrl, editedSize: size });
    } catch (e) {
      setError('Format conversion failed. Please try again.');
      console.error(e);
    } finally {
      setPartial({ isProcessing: false });
    }
  }, [state.originalDataUrl, state.editedDataUrl, state.outputFormat, state.compressionQuality]);

  // ─── Download ──────────────────────────────────────────────────────────────

  const downloadEdited = useCallback(() => {
    if (!state.editedDataUrl || !state.originalFile) return;

    const link = document.createElement('a');
    link.href = state.editedDataUrl;
    const baseName = getFilenameWithoutExt(state.originalFile.name);
    link.download = `${baseName}_edited.${state.outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [state.editedDataUrl, state.originalFile, state.outputFormat]);

  // ─── Reset ─────────────────────────────────────────────────────────────────

  const reset = useCallback(() => {
    setState({
      originalFile: null,
      originalDataUrl: null,
      editedDataUrl: null,
      outputFormat: 'jpg',
      compressionQuality: 80,
      cropArea: null,
      activeTool: 'compress',
      isProcessing: false,
      originalSize: 0,
      editedSize: 0,
    });
    setError(null);
    pendingCropRef.current = null;
  }, []);

  const resetEdits = useCallback(() => {
    if (state.originalDataUrl && state.originalFile) {
      setPartial({
        editedDataUrl: state.originalDataUrl,
        editedSize: state.originalFile.size,
        cropArea: null,
      });
      pendingCropRef.current = null;
    }
  }, [state.originalDataUrl, state.originalFile]);

  // ─── Derived ───────────────────────────────────────────────────────────────

  const estimatedSize = estimateCompressedSize(
    state.originalSize,
    state.compressionQuality
  );

  // Get the blob of the edited image
  const getEditedBlob = useCallback((): Blob | null => {
    if (!state.editedDataUrl) return null;
    return dataUrlToBlob(state.editedDataUrl);
  }, [state.editedDataUrl]);

  const getOriginalBlob = useCallback((): Blob | null => {
    if (!state.originalFile) return null;
    return state.originalFile;
  }, [state.originalFile]);

  return {
    state,
    error,
    estimatedSize,
    setPartial,
    handleFileUpload,
    applyCompression,
    setCropArea,
    applyCrop,
    applyFormatConversion,
    downloadEdited,
    reset,
    resetEdits,
    getEditedBlob,
    getOriginalBlob,
    setError,
  };
}