export type ImageFormat = 'jpg' | 'jpeg' | 'png' | 'gif' | 'webp';
export type EditType = 'compression' | 'crop' | 'format' | 'combined';
export type AspectRatio = '1:1' | '16:9' | '9:16' | 'free';
export type ActiveTool = 'compress' | 'crop' | 'format';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditorState {
  originalFile: File | null;
  originalDataUrl: string | null;
  editedDataUrl: string | null;
  outputFormat: ImageFormat;
  compressionQuality: number;
  cropArea: CropArea | null;
  activeTool: ActiveTool;
  isProcessing: boolean;
  originalSize: number;
  editedSize: number;
}

export interface EditHistoryRecord {
  id: string;
  user_id: string;
  original_url: string;
  edited_url: string;
  edit_type: EditType;
  format: ImageFormat;
  original_size: number;
  edited_size: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface User {
  id: string;
  email?: string;
}