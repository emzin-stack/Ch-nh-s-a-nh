import imageCompression from 'browser-image-compression';
import { CropArea, ImageFormat } from '@/types';

// ─── Compress ────────────────────────────────────────────────────────────────

export async function compressImage(
  file: File,
  quality: number // 0–100
): Promise<{ blob: Blob; dataUrl: string; size: number }> {
  // quality 0-100 → maxSizeMB mapping (higher quality = larger file)
  // quality 100 → 10MB cap (essentially lossless)
  // quality 0   → 0.05MB cap (very aggressive)
  const maxSizeMB = 0.05 + (quality / 100) * 9.95;

  const options = {
    maxSizeMB,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    fileType: file.type as string,
    initialQuality: quality / 100,
  };

  try {
    const compressed = await imageCompression(file, options);
    const dataUrl = await blobToDataUrl(compressed);
    return { blob: compressed, dataUrl, size: compressed.size };
  } catch {
    // Fallback: canvas-based compression
    return canvasCompress(file, quality);
  }
}

async function canvasCompress(
  file: File,
  quality: number
): Promise<{ blob: Blob; dataUrl: string; size: number }> {
  const img = await fileToImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas toBlob failed'));
        blobToDataUrl(blob).then((dataUrl) =>
          resolve({ blob, dataUrl, size: blob.size })
        );
      },
      file.type,
      quality / 100
    );
  });
}

// ─── Crop ─────────────────────────────────────────────────────────────────────

export async function cropImage(
  sourceDataUrl: string,
  cropArea: CropArea
): Promise<{ blob: Blob; dataUrl: string; size: number }> {
  const img = await dataUrlToImage(sourceDataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = cropArea.width;
  canvas.height = cropArea.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(
    img,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    cropArea.width,
    cropArea.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Canvas crop failed'));
        blobToDataUrl(blob).then((dataUrl) =>
          resolve({ blob, dataUrl, size: blob.size })
        );
      },
      'image/png',
      1.0
    );
  });
}

// ─── Format Conversion ────────────────────────────────────────────────────────

export async function convertFormat(
  sourceDataUrl: string,
  targetFormat: ImageFormat,
  quality = 0.92
): Promise<{ blob: Blob; dataUrl: string; size: number }> {
  const img = await dataUrlToImage(sourceDataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d')!;

  // For JPEG, fill white background (no transparency)
  if (targetFormat === 'jpg' || targetFormat === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  const mimeType = formatToMime(targetFormat);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) return reject(new Error('Format conversion failed'));
        blobToDataUrl(blob).then((dataUrl) =>
          resolve({ blob, dataUrl, size: blob.size })
        );
      },
      mimeType,
      quality
    );
  });
}

// ─── Combined Pipeline ────────────────────────────────────────────────────────

export async function processImage(params: {
  file: File;
  cropArea?: CropArea | null;
  compressionQuality?: number;
  outputFormat?: ImageFormat;
}): Promise<{ blob: Blob; dataUrl: string; size: number }> {
  const { file, cropArea, compressionQuality = 85, outputFormat } = params;

  let currentDataUrl = await fileToDataUrl(file);

  // Step 1: Crop if needed
  if (cropArea) {
    const result = await cropImage(currentDataUrl, cropArea);
    currentDataUrl = result.dataUrl;
  }

  // Step 2: Format conversion + compression
  const targetFormat = outputFormat ?? (file.type.split('/')[1] as ImageFormat);
  const { blob, dataUrl, size } = await convertFormat(
    currentDataUrl,
    targetFormat,
    compressionQuality / 100
  );

  return { blob, dataUrl, size };
}

// ─── Estimate Size ─────────────────────────────────────────────────────────────

export function estimateCompressedSize(originalSize: number, quality: number): number {
  // Rough estimate: quality 100 ≈ 80% of original, quality 0 ≈ 3%
  const ratio = 0.03 + (quality / 100) * 0.77;
  return Math.round(originalSize * ratio);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatToMime(format: ImageFormat): string {
  const map: Record<ImageFormat, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
  };
  return map[format] ?? 'image/jpeg';
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function dataUrlToImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function getFilenameWithoutExt(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '');
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new Blob([u8arr], { type: mime });
}