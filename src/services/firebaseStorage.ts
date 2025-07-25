/**
 * Firebase Storage Service
 * Service for handling file uploads to Firebase Storage
 */

import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  uploadBytesResumable
} from 'firebase/storage';
import type { UploadTaskSnapshot } from 'firebase/storage';
import { storage } from './firebase';

export interface UploadProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
}

export interface UploadResult {
  url: string;
  path: string;
  metadata: {
    name: string;
    size: number;
    contentType: string;
    timeCreated: string;
  };
}

export class FirebaseStorageService {
  /**
   * Upload avatar image with progress tracking
   */
  static async uploadAvatar(
    userId: string, 
    file: File,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Create storage reference
      const filename = `avatar_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `avatars/${userId}/${filename}`);

      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<UploadResult>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.({ progress, snapshot });
          },
          (error) => {
            console.error('Upload failed:', error);
            reject(new Error(`Upload failed: ${error.message}`));
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const metadata = uploadTask.snapshot.metadata;
              
              resolve({
                url: downloadURL,
                path: storageRef.fullPath,
                metadata: {
                  name: metadata.name || filename,
                  size: metadata.size || file.size,
                  contentType: metadata.contentType || file.type,
                  timeCreated: metadata.timeCreated || new Date().toISOString(),
                }
              });
            } catch (error) {
              reject(new Error(`Failed to get download URL: ${error}`));
            }
          }
        );
      });
    } catch (error) {
      throw new Error(`Avatar upload failed: ${error}`);
    }
  }

  /**
   * Upload avatar image without progress tracking (simpler version)
   */
  static async uploadAvatarSimple(userId: string, file: File): Promise<UploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // Create storage reference
      const filename = `avatar_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `avatars/${userId}/${filename}`);

      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        url: downloadURL,
        path: storageRef.fullPath,
        metadata: {
          name: snapshot.metadata.name || filename,
          size: snapshot.metadata.size || file.size,
          contentType: snapshot.metadata.contentType || file.type,
          timeCreated: snapshot.metadata.timeCreated || new Date().toISOString(),
        }
      };
    } catch (error) {
      throw new Error(`Avatar upload failed: ${error}`);
    }
  }

  /**
   * Delete avatar image from storage
   */
  static async deleteAvatar(storagePath: string): Promise<void> {
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Failed to delete avatar:', error);
      throw new Error(`Failed to delete avatar: ${error}`);
    }
  }

  /**
   * Generate a storage path for avatar
   */
  static generateAvatarPath(userId: string, filename: string): string {
    return `avatars/${userId}/${filename}`;
  }

  /**
   * Get file extension from filename
   */
  static getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { isValid: false, error: 'Only image files are allowed' };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 5MB' };
    }

    // Check supported formats
    const supportedFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const extension = this.getFileExtension(file.name);
    if (!supportedFormats.includes(extension)) {
      return { 
        isValid: false, 
        error: `Unsupported format. Supported formats: ${supportedFormats.join(', ')}` 
      };
    }

    return { isValid: true };
  }
}

export default FirebaseStorageService;
