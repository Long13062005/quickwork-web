/**
 * useProfileUpdate hook
 * Handles profile update operations with optimistic updates and conflict resolution
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { useProfile } from './useProfile';
import { useProfileValidation } from './useProfileValidation';
import toast from 'react-hot-toast';
import type {
  Profile,
  ProfileUpdatePayload,
} from '../types/profile.types';

/**
 * Update operation type
 */
type UpdateOperation = 'save_draft' | 'publish' | 'auto_save';

/**
 * Hook return type
 */
interface UseProfileUpdateReturn {
  // State
  isSaving: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  
  // Update methods
  updateField: (fieldPath: string, value: any) => void;
  updateMultipleFields: (updates: Record<string, any>) => void;
  saveProfile: (operation?: UpdateOperation) => Promise<boolean>;
  saveDraft: () => Promise<boolean>;
  publishProfile: () => Promise<boolean>;
  
  // Auto-save control
  enableAutoSave: () => void;
  disableAutoSave: () => void;
  
  // Conflict resolution
  resolveConflict: (useLocal: boolean) => void;
  hasConflict: boolean;
  
  // Utilities
  discardChanges: () => void;
  previewChanges: () => Partial<Profile> | null;
}

/**
 * Profile update hook with auto-save and conflict resolution
 * @param autoSaveInterval - Auto-save interval in milliseconds (default: 30000)
 * @returns Profile update utilities
 */
export function useProfileUpdate(autoSaveInterval: number = 30000): UseProfileUpdateReturn {
  const {
    profile,
    updateProfileData,
    updateLocalProfile,
    markFormDirty,
    isDirty,
    isUpdating,
  } = useProfile();
  
  const { validateForm } = useProfileValidation();
  
  // Local state
  const [isSaving, setIsSaving] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Partial<Profile>>({});
  const [originalProfile, setOriginalProfile] = useState<Profile | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  
  // Refs for timers and state
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const conflictData = useRef<Profile | null>(null);
  
  /**
   * Set up auto-save timer
   */
  const setupAutoSave = useCallback(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    
    if (autoSaveEnabled && isDirty && Object.keys(pendingChanges).length > 0) {
      autoSaveTimer.current = setTimeout(() => {
        if (isDirty) {
          saveProfile('auto_save');
        }
      }, autoSaveInterval);
    }
  }, [autoSaveEnabled, isDirty, pendingChanges, autoSaveInterval]);
  
  /**
   * Update a single field with optimistic update
   */
  const updateField = useCallback((fieldPath: string, value: any) => {
    if (!profile) return;
    
    // Store original profile for conflict resolution
    if (!originalProfile) {
      setOriginalProfile({ ...profile });
    }
    
    // Update local state optimistically
    const pathParts = fieldPath.split('.');
    const update: any = {};
    let current = update;
    
    // Build nested update object
    for (let i = 0; i < pathParts.length - 1; i++) {
      current[pathParts[i]] = {};
      current = current[pathParts[i]];
    }
    current[pathParts[pathParts.length - 1]] = value;
    
    // Merge with pending changes
    const newPendingChanges: any = { ...pendingChanges };
    let pendingCurrent: any = newPendingChanges;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!pendingCurrent[pathParts[i]]) {
        pendingCurrent[pathParts[i]] = {};
      }
      pendingCurrent = pendingCurrent[pathParts[i]] as any;
    }
    pendingCurrent[pathParts[pathParts.length - 1]] = value;
    
    setPendingChanges(newPendingChanges);
    updateLocalProfile(update);
    markFormDirty(true);
    
    // Setup auto-save
    setupAutoSave();
  }, [profile, originalProfile, pendingChanges, updateLocalProfile, markFormDirty, setupAutoSave]);
  
  /**
   * Update multiple fields at once
   */
  const updateMultipleFields = useCallback((updates: Record<string, any>) => {
    if (!profile) return;
    
    // Store original profile for conflict resolution
    if (!originalProfile) {
      setOriginalProfile({ ...profile });
    }
    
    // Merge updates with pending changes
    const newPendingChanges: any = { ...pendingChanges, ...updates };
    setPendingChanges(newPendingChanges);
    updateLocalProfile(updates);
    markFormDirty(true);
    
    // Setup auto-save
    setupAutoSave();
  }, [profile, originalProfile, pendingChanges, updateLocalProfile, markFormDirty, setupAutoSave]);
  
  /**
   * Save profile with the specified operation
   */
  const saveProfile = useCallback(async (operation: UpdateOperation = 'save_draft'): Promise<boolean> => {
    if (!profile || Object.keys(pendingChanges).length === 0) {
      return true;
    }
    
    const isAutoSave = operation === 'auto_save';
    
    if (isAutoSave) {
      setIsAutoSaving(true);
    } else {
      setIsSaving(true);
    }
    
    try {
      // Validate if publishing
      if (operation === 'publish') {
        // Simple validation - check if required fields are present
        if (!profile.firstName || !profile.lastName || !profile.email) {
          if (!isAutoSave) {
            toast.error('Please fill in all required fields before publishing');
          }
          return false;
        }
      }
      
      // Prepare update payload
      const updatePayload: ProfileUpdatePayload = {
        ...pendingChanges,
        ...(operation === 'publish' && { status: 'active' }),
      };
      
      // Attempt to save
      await updateProfileData(updatePayload);
      
      // Success
      setPendingChanges({});
      setOriginalProfile(null);
      setLastSaved(new Date());
      markFormDirty(false);
      
      if (!isAutoSave) {
        toast.success(
          operation === 'publish' 
            ? 'Profile published successfully!' 
            : 'Profile saved successfully!'
        );
      }
      
      return true;
      
    } catch (error: any) {
      // Handle conflicts
      if (error.message.includes('conflict') || error.message.includes('version')) {
        setHasConflict(true);
        conflictData.current = profile;
        
        if (!isAutoSave) {
          toast.error('Profile was updated by another session. Please resolve the conflict.');
        }
      } else {
        if (!isAutoSave) {
          toast.error(`Failed to save profile: ${error.message}`);
        }
      }
      
      return false;
    } finally {
      if (isAutoSave) {
        setIsAutoSaving(false);
      } else {
        setIsSaving(false);
      }
    }
  }, [profile, pendingChanges, validateForm, updateProfileData, markFormDirty]);
  
  /**
   * Save as draft
   */
  const saveDraft = useCallback(async (): Promise<boolean> => {
    return saveProfile('save_draft');
  }, [saveProfile]);
  
  /**
   * Publish profile
   */
  const publishProfile = useCallback(async (): Promise<boolean> => {
    return saveProfile('publish');
  }, [saveProfile]);
  
  /**
   * Enable auto-save
   */
  const enableAutoSave = useCallback(() => {
    setAutoSaveEnabled(true);
    setupAutoSave();
  }, [setupAutoSave]);
  
  /**
   * Disable auto-save
   */
  const disableAutoSave = useCallback(() => {
    setAutoSaveEnabled(false);
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }
  }, []);
  
  /**
   * Resolve conflict by choosing local or remote version
   */
  const resolveConflict = useCallback((useLocal: boolean) => {
    if (useLocal && conflictData.current) {
      // Keep local changes, will retry save
      setHasConflict(false);
      conflictData.current = null;
      toast.success('Using local changes. Saving...');
      saveProfile('save_draft');
    } else {
      // Discard local changes, reload remote
      setPendingChanges({});
      setOriginalProfile(null);
      setHasConflict(false);
      conflictData.current = null;
      markFormDirty(false);
      toast.success('Local changes discarded. Profile reloaded.');
      // The profile will be automatically refetched
    }
  }, [saveProfile, markFormDirty]);
  
  /**
   * Discard all local changes
   */
  const discardChanges = useCallback(() => {
    if (originalProfile) {
      updateLocalProfile(originalProfile);
    }
    setPendingChanges({});
    setOriginalProfile(null);
    markFormDirty(false);
    
    // Clear auto-save timer
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = null;
    }
    
    toast.success('Changes discarded');
  }, [originalProfile, updateLocalProfile, markFormDirty]);
  
  /**
   * Get preview of pending changes
   */
  const previewChanges = useCallback((): Partial<Profile> | null => {
    return Object.keys(pendingChanges).length > 0 ? pendingChanges : null;
  }, [pendingChanges]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);
  
  return {
    // State
    isSaving: isSaving || isUpdating,
    isAutoSaving,
    lastSaved,
    hasUnsavedChanges: isDirty || Object.keys(pendingChanges).length > 0,
    
    // Update methods
    updateField,
    updateMultipleFields,
    saveProfile,
    saveDraft,
    publishProfile,
    
    // Auto-save control
    enableAutoSave,
    disableAutoSave,
    
    // Conflict resolution
    resolveConflict,
    hasConflict,
    
    // Utilities
    discardChanges,
    previewChanges,
  };
}
