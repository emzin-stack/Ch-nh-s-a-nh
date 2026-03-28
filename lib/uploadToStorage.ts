import { supabase } from './supabase';
import { ImageFormat, EditType } from '@/types';

const BUCKET = 'images';

export async function uploadImageToStorage(
  userId: string,
  blob: Blob,
  filename: string,
  folder: 'originals' | 'edited'
): Promise<string> {
  const ext = blob.type.split('/')[1] ?? 'jpg';
  const path = `${userId}/${folder}/${filename}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, {
      contentType: blob.type,
      upsert: true,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function saveEditHistory(params: {
  userId: string;
  originalBlob: Blob;
  editedBlob: Blob;
  editType: EditType;
  format: ImageFormat;
  originalSize: number;
  editedSize: number;
  originalFilename: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  const {
    userId,
    originalBlob,
    editedBlob,
    editType,
    format,
    originalSize,
    editedSize,
    originalFilename,
    metadata = {},
  } = params;

  const timestamp = Date.now();
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');

  const [originalUrl, editedUrl] = await Promise.all([
    uploadImageToStorage(userId, originalBlob, `${baseName}_${timestamp}_orig`, 'originals'),
    uploadImageToStorage(userId, editedBlob, `${baseName}_${timestamp}_edit`, 'edited'),
  ]);

  const { error } = await supabase.from('edit_history').insert({
    user_id: userId,
    original_url: originalUrl,
    edited_url: editedUrl,
    edit_type: editType,
    format,
    original_size: originalSize,
    edited_size: editedSize,
    metadata,
  });

  if (error) throw new Error(`Failed to save history: ${error.message}`);
}