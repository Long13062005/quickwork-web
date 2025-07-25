/**
 * useAvatarUpload Hook
 * React hook for handling avatar image uploads with Firebase Storage
 */

import { useState, useCallback } from 'react';
// TODO: Re-import when profile module is rebuilt
// import { useAppDispatch } from '../hooks';
// import { updateCurrentProfileLocal } from '../features/profile/ProfileSlice';
import FirebaseStorageService, { type UploadProgress, type UploadResult } from '../services/firebaseStorage';
import toast from 'react-hot-toast';

interface UseAvatarUploadOptions {
  userId: string;
  onSuccess?: (result: UploadResult) => void;
  onError?: (error: string) => void;
  withProgress?: boolean;
}

interface UseAvatarUploadReturn {
  isUploading: boolean;
  progress: number;
  uploadAvatar: (file: File) => Promise<void>;
  deleteAvatar: (storagePath: string) => Promise<void>;
  validateFile: (file: File) => { isValid: boolean; error?: string };
}

export const useAvatarUpload = ({
  userId,
  onSuccess,
  onError,
  withProgress = true
}: UseAvatarUploadOptions): UseAvatarUploadReturn => {
  // TODO: Re-add when profile module is rebuilt
  // const dispatch = useAppDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  /**
   * Upload avatar image
   */
  const uploadAvatar = useCallback(async (file: File): Promise<void> => {
    try {
      // Validate file
      const validation = FirebaseStorageService.validateImageFile(file);
      if (!validation.isValid) {
        const errorMessage = validation.error || 'Invalid file';
        onError?.(errorMessage);
        toast.error(errorMessage);
        return;
      }

      setIsUploading(true);
      setProgress(0);

      // Show loading toast
      const toastId = toast.loading('Uploading avatar...');

      let result: UploadResult;

      if (withProgress) {
        // Upload with progress tracking
        result = await FirebaseStorageService.uploadAvatar(
          userId,
          file,
          (uploadProgress: UploadProgress) => {
            setProgress(uploadProgress.progress);
            toast.loading(`Uploading avatar... ${Math.round(uploadProgress.progress)}%`, { id: toastId });
          }
        );
      } else {
        // Simple upload without progress
        result = await FirebaseStorageService.uploadAvatarSimple(userId, file);
      }

      // Update profile in local state
      // TODO: Re-implement when profile module is rebuilt
      // dispatch(updateCurrentProfileLocal({
      //   avatarUrl: result.url,
      //   avatar: result.path // Keep path for deletion
      // }));

      // Success callback
      onSuccess?.(result);
      toast.success('Avatar uploaded successfully!', { id: toastId });

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to upload avatar';
      console.error('Avatar upload error:', error);
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  }, [userId, onSuccess, onError, withProgress]);

  /**
   * Delete avatar image
   */
  const deleteAvatar = useCallback(async (storagePath: string): Promise<void> => {
    try {
      const toastId = toast.loading('Deleting avatar...');

      await FirebaseStorageService.deleteAvatar(storagePath);

      // Update profile in local state
      // TODO: Re-implement when profile module is rebuilt
      // dispatch(updateCurrentProfileLocal({
      //   avatarUrl: undefined,
      //   avatar: undefined
      // }));

      toast.success('Avatar deleted successfully!', { id: toastId });

    } catch (error: any) {
      const errorMessage = error.message || 'Failed to delete avatar';
      console.error('Avatar deletion error:', error);
      onError?.(errorMessage);
      toast.error(errorMessage);
    }
  }, [onError]);

  /**
   * Validate file before upload
   */
  const validateFile = useCallback((file: File) => {
    return FirebaseStorageService.validateImageFile(file);
  }, []);

  return {
    isUploading,
    progress,
    uploadAvatar,
    deleteAvatar,
    validateFile
  };
};
