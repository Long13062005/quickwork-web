/**
 * useProfile Hook
 * Main hook for profile data management
 */

import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import {
  fetchProfile,
  fetchMyProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  fetchProfiles,
  clearError,
  clearCurrentProfile,
  setCurrentProfile,
} from '../ProfileSlice';
import type { Profile, LegacyCreateProfileRequest, LegacyUpdateProfileRequest } from '../types/profile.types';

export const useProfile = () => {
  const dispatch = useAppDispatch();
  const profileState = useAppSelector((state) => state.profile);

  // Fetch profile by userId
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const result = await dispatch(fetchProfile(userId)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Fetch current user's profile
  const fetchCurrentProfile = useCallback(async () => {
    try {
      const result = await dispatch(fetchMyProfile()).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to fetch current profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Create new profile
  const createNewProfile = useCallback(async (request: LegacyCreateProfileRequest) => {
    try {
      const result = await dispatch(createProfile(request)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to create profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Update existing profile
  const updateCurrentProfile = useCallback(async (request: LegacyUpdateProfileRequest) => {
    try {
      const result = await dispatch(updateProfile(request)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Delete profile
  const deleteCurrentProfile = useCallback(async (profileId: string) => {
    try {
      await dispatch(deleteProfile(profileId)).unwrap();
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw error;
    }
  }, [dispatch]);

  // Fetch all profiles
  const fetchAllProfiles = useCallback(async () => {
    try {
      const result = await dispatch(fetchProfiles()).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      throw error;
    }
  }, [dispatch]);

  // Set current profile manually
  const setCurrentUserProfile = useCallback((profile: Profile) => {
    dispatch(setCurrentProfile(profile));
  }, [dispatch]);

  // Clear current profile
  const clearCurrentUserProfile = useCallback(() => {
    dispatch(clearCurrentProfile());
  }, [dispatch]);

  // Clear any errors
  const clearProfileError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Reset profile state
  const resetProfile = useCallback(() => {
    dispatch(clearCurrentProfile());
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    currentProfile: profileState.currentProfile,
    profiles: profileState.profiles,
    loading: profileState.loading,
    error: profileState.error,
    isCreating: profileState.isCreating,
    isUpdating: profileState.isUpdating,

    // Actions
    fetchProfile: fetchUserProfile,
    fetchMyProfile: fetchCurrentProfile,
    createProfile: createNewProfile,
    updateProfile: updateCurrentProfile,
    deleteProfile: deleteCurrentProfile,
    fetchProfiles: fetchAllProfiles,
    setCurrentProfile: setCurrentUserProfile,
    clearCurrentProfile: clearCurrentUserProfile,
    clearError: clearProfileError,
    resetProfile,

    // Computed values
    hasProfile: !!profileState.currentProfile,
    isJobSeeker: profileState.currentProfile?.role === 'jobseeker',
    isEmployer: profileState.currentProfile?.role === 'employer',
    isAdmin: profileState.currentProfile?.role === 'admin',
    isProfileComplete: profileState.currentProfile?.isComplete || false,
  };
};
