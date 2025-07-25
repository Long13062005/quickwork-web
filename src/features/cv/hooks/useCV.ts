/**
 * CV Hooks
 * Custom hooks for CV operations
 */

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { 
  uploadCV, 
  getMyCVs, 
  getCVById, 
  updateCV, 
  deleteCV, 
  setCurrentCV,
  clearError,
  clearUploadProgress,
  resetCVState
} from '../cvSlice';
import { cvApiService } from '../../../services/cv/cvApi';
import type { CVUploadRequest, CVUpdateRequest } from '../types/cv.types';

/**
 * Main CV hook
 */
export const useCV = () => {
  const dispatch = useAppDispatch();
  const cvState = useAppSelector(state => state.cv);

  // Upload CV
  const handleUploadCV = useCallback(async (request: CVUploadRequest) => {
    return dispatch(uploadCV(request));
  }, [dispatch]);

  // Get my CVs
  const handleGetMyCVs = useCallback(async () => {
    return dispatch(getMyCVs());
  }, [dispatch]);

  // Get CV by ID
  const handleGetCVById = useCallback(async (id: number) => {
    return dispatch(getCVById(id));
  }, [dispatch]);

  // Update CV
  const handleUpdateCV = useCallback(async (request: CVUpdateRequest) => {
    return dispatch(updateCV(request));
  }, [dispatch]);

  // Delete CV
  const handleDeleteCV = useCallback(async (id: number) => {
    return dispatch(deleteCV(id));
  }, [dispatch]);

  // Download CV
  const handleDownloadCV = useCallback(async (id: number, filename: string) => {
    try {
      const blob = await cvApiService.downloadCV(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }, []);

  // Set current CV
  const handleSetCurrentCV = useCallback((cv: any) => {
    dispatch(setCurrentCV(cv));
  }, [dispatch]);

  // Clear error
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear upload progress
  const handleClearUploadProgress = useCallback(() => {
    dispatch(clearUploadProgress());
  }, [dispatch]);

  // Reset CV state
  const handleResetCVState = useCallback(() => {
    dispatch(resetCVState());
  }, [dispatch]);

  return {
    // State
    cvs: cvState.cvs,
    currentCV: cvState.currentCV,
    totalElements: cvState.totalElements,
    loading: cvState.loading,
    uploading: cvState.uploading,
    uploadProgress: cvState.uploadProgress,
    error: cvState.error,
    
    // Actions
    uploadCV: handleUploadCV,
    getMyCVs: handleGetMyCVs,
    getCVById: handleGetCVById,
    updateCV: handleUpdateCV,
    deleteCV: handleDeleteCV,
    downloadCV: handleDownloadCV,
    setCurrentCV: handleSetCurrentCV,
    clearError: handleClearError,
    clearUploadProgress: handleClearUploadProgress,
    resetCVState: handleResetCVState
  };
};
