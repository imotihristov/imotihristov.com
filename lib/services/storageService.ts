import { supabase } from '../supabase';

const BUCKET_NAME = 'property-images';

/**
 * Upload a file to Supabase Storage
 */
export const uploadImage = async (file: File, folder: string = 'properties'): Promise<string> => {
  // Generate a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading image:', error);
    throw error;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
};

/**
 * Upload multiple files to Supabase Storage
 */
export const uploadImages = async (files: File[], folder: string = 'properties'): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return Promise.all(uploadPromises);
};

/**
 * Delete an image from Supabase Storage
 */
export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    // Extract the path from the full URL
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/');
    const bucketIndex = pathParts.findIndex(part => part === BUCKET_NAME);
    
    if (bucketIndex === -1) {
      console.warn('Image URL does not belong to property-images bucket, skipping:', imageUrl);
      return;
    }

    const filePath = pathParts.slice(bucketIndex + 1).join('/');

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  } catch (err) {
    // If URL parsing fails or it's not a Supabase URL, just skip it
    console.warn('Could not delete image (possibly external URL):', imageUrl);
  }
};

/**
 * Delete multiple images from Supabase Storage
 */
export const deleteImages = async (imageUrls: string[]): Promise<void> => {
  const deletePromises = imageUrls.map(url => deleteImage(url));
  await Promise.all(deletePromises);
};

/**
 * List all images in a folder
 */
export const listImages = async (folder: string = 'properties'): Promise<string[]> => {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list(folder, {
      limit: 100,
      sortBy: { column: 'created_at', order: 'desc' },
    });

  if (error) {
    console.error('Error listing images:', error);
    throw error;
  }

  return (data || []).map(file => {
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(`${folder}/${file.name}`);
    return urlData.publicUrl;
  });
};
