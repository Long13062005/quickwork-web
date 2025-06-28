/**
 * useProfile hook
 * Main hook for profile operations and state management
 */

import { useCallback, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import {
  fetchCurrentProfile,
  fetchProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  uploadAvatar,
  uploadResume,
  clearError,
  setFormDirty,
  updateCurrentProfileLocal,
  selectCurrentProfile,
  selectProfileLoading,
  selectProfileUpdating,
  selectProfileError,
  selectProfileIsDirty,
} from '../ProfileSlice';
import type {
  Profile,
  UserRole,
  JobSeekerProfileFormData,
  EmployerProfileFormData,
  ProfileUpdatePayload,
} from '../types/profile.types';

/**
 * Hook return type
 */
interface UseProfileReturn {
  // State
  profile: Profile | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
  isDirty: boolean;

  // Actions
  fetchProfile: () => void;
  fetchProfileById: (profileId: string) => void;
  createNewProfile: (role: UserRole, data: JobSeekerProfileFormData | EmployerProfileFormData) => Promise<void>;
  updateProfileData: (updates: ProfileUpdatePayload) => Promise<void>;
  deleteCurrentProfile: () => Promise<void>;
  uploadProfileAvatar: (file: File) => Promise<void>;
  uploadProfileResume: (file: File) => Promise<void>;
  updateLocalProfile: (updates: Partial<Profile>) => void;
  markFormDirty: (dirty: boolean) => void;
  clearProfileError: () => void;
}

/**
 * Main profile hook for managing profile state and operations
 * @returns Profile state and operations
 */
export function useProfile(): UseProfileReturn {
  const dispatch = useAppDispatch();
  
  // Selectors
  const profile = useAppSelector(selectCurrentProfile);
  const isLoading = useAppSelector(selectProfileLoading);
  const isUpdating = useAppSelector(selectProfileUpdating);
  const error = useAppSelector(selectProfileError);
  const isDirty = useAppSelector(selectProfileIsDirty);

  // Fetch current user's profile
  const fetchProfile = useCallback(() => {
    dispatch(fetchCurrentProfile());
  }, [dispatch]);

  // Fetch profile by ID
  const fetchProfileByIdCallback = useCallback((profileId: string) => {
    dispatch(fetchProfileById(profileId));
  }, [dispatch]);

  // Create new profile
  const createNewProfile = useCallback(async (
    role: UserRole,
    data: JobSeekerProfileFormData | EmployerProfileFormData
  ) => {
    const result = await dispatch(createProfile({ role, profileData: data }));
    if (createProfile.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  }, [dispatch]);

  // Update profile
  const updateProfileData = useCallback(async (updates: ProfileUpdatePayload) => {
    if (!profile?.id) {
      throw new Error('No profile ID available');
    }
    
    const result = await dispatch(updateProfile({ profileId: profile.id, updates }));
    if (updateProfile.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  }, [dispatch, profile?.id]);

  // Delete profile
  const deleteCurrentProfile = useCallback(async () => {
    if (!profile?.id) {
      throw new Error('No profile ID available');
    }
    
    const result = await dispatch(deleteProfile(profile.id));
    if (deleteProfile.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  }, [dispatch, profile?.id]);

  // Upload avatar
  const uploadProfileAvatar = useCallback(async (file: File) => {
    if (!profile?.id) {
      throw new Error('No profile ID available');
    }
    
    const result = await dispatch(uploadAvatar({ profileId: profile.id, file }));
    if (uploadAvatar.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  }, [dispatch, profile?.id]);

  // Upload resume
  const uploadProfileResume = useCallback(async (file: File) => {
    if (!profile?.id) {
      throw new Error('No profile ID available');
    }
    
    const result = await dispatch(uploadResume({ profileId: profile.id, file }));
    if (uploadResume.rejected.match(result)) {
      throw new Error(result.payload as string);
    }
  }, [dispatch, profile?.id]);

  // Update local profile (optimistic updates)
  const updateLocalProfile = useCallback((updates: Partial<Profile>) => {
    dispatch(updateCurrentProfileLocal(updates));
  }, [dispatch]);

  // Mark form as dirty/clean
  const markFormDirty = useCallback((dirty: boolean) => {
    dispatch(setFormDirty(dirty));
  }, [dispatch]);

  // Clear error
  const clearProfileError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Auto-fetch profile on mount if not present
  useEffect(() => {
    if (!profile && !isLoading && !error) {
      fetchProfile();
    }
  }, [profile, isLoading, error, fetchProfile]);

  return {
    // State
    profile,
    isLoading,
    isUpdating,
    error,
    isDirty,

    // Actions
    fetchProfile,
    fetchProfileById: fetchProfileByIdCallback,
    createNewProfile,
    updateProfileData,
    deleteCurrentProfile,
    uploadProfileAvatar,
    uploadProfileResume,
    updateLocalProfile,
    markFormDirty,
    clearProfileError,
  };
}
