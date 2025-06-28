/**
 * Profile Redux slice
 * Manages profile state with Redux Toolkit
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Profile,
  ProfileState,
  ProfileUpdatePayload,
  ProfileSearchParams,
  JobSeekerProfileFormData,
  EmployerProfileFormData,
  UserRole,
  ProfileValidationErrors,
  WorkExperience,
  Education,
  Project,
  Certification,
  ProfileStatus,
} from './types/profile.types';
import { profileApiService } from './api/profileApi';

/**
 * Initial state
 */
const initialState: ProfileState = {
  currentProfile: null,
  isLoading: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  validationErrors: null,
  isDirty: false,
  isValid: true,
  lastFetchedAt: null,
  profiles: [],
  profilesLoading: false,
  profilesError: null,
};

/**
 * Async thunks for profile operations
 */

// Get current user's profile
export const fetchCurrentProfile = createAsyncThunk(
  'profile/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApiService.getCurrentProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Get profile by ID
export const fetchProfileById = createAsyncThunk(
  'profile/fetchById',
  async (profileId: string, { rejectWithValue }) => {
    try {
      const response = await profileApiService.getProfileById(profileId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Create new profile
export const createProfile = createAsyncThunk(
  'profile/create',
  async (
    { role, profileData }: {
      role: UserRole;
      profileData: JobSeekerProfileFormData | EmployerProfileFormData;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.createProfile(role, profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create profile');
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'profile/update',
  async (
    { profileId, updates }: { profileId: string; updates: ProfileUpdatePayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.updateProfile(profileId, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Delete profile
export const deleteProfile = createAsyncThunk(
  'profile/delete',
  async (profileId: string, { rejectWithValue }) => {
    try {
      await profileApiService.deleteProfile(profileId);
      return profileId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete profile');
    }
  }
);

// Search profiles
export const searchProfiles = createAsyncThunk(
  'profile/search',
  async (params: ProfileSearchParams, { rejectWithValue }) => {
    try {
      const response = await profileApiService.searchProfiles(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search profiles');
    }
  }
);

// Upload avatar
export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (
    { profileId, file }: { profileId: string; file: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.uploadAvatar(profileId, file);
      return { profileId, url: response.url };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

// Upload resume
export const uploadResume = createAsyncThunk(
  'profile/uploadResume',
  async (
    { profileId, file }: { profileId: string; file: File },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.uploadResume(profileId, file);
      return { profileId, url: response.url };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload resume');
    }
  }
);

// Work experience operations
export const addWorkExperience = createAsyncThunk(
  'profile/addWorkExperience',
  async (
    { profileId, experience }: {
      profileId: string;
      experience: Omit<WorkExperience, 'id'>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.addWorkExperience(profileId, experience);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add work experience');
    }
  }
);

export const updateWorkExperience = createAsyncThunk(
  'profile/updateWorkExperience',
  async (
    { profileId, experienceId, updates }: {
      profileId: string;
      experienceId: string;
      updates: Partial<WorkExperience>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.updateWorkExperience(profileId, experienceId, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update work experience');
    }
  }
);

export const deleteWorkExperience = createAsyncThunk(
  'profile/deleteWorkExperience',
  async (
    { profileId, experienceId }: { profileId: string; experienceId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.deleteWorkExperience(profileId, experienceId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete work experience');
    }
  }
);

// Education operations
export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async (
    { profileId, education }: {
      profileId: string;
      education: Omit<Education, 'id'>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.addEducation(profileId, education);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add education');
    }
  }
);

// Project operations
export const addProject = createAsyncThunk(
  'profile/addProject',
  async (
    { profileId, project }: {
      profileId: string;
      project: Omit<Project, 'id'>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.addProject(profileId, project);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add project');
    }
  }
);

// Certification operations
export const addCertification = createAsyncThunk(
  'profile/addCertification',
  async (
    { profileId, certification }: {
      profileId: string;
      certification: Omit<Certification, 'id'>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.addCertification(profileId, certification);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add certification');
    }
  }
);

// Update profile status
export const updateProfileStatus = createAsyncThunk(
  'profile/updateStatus',
  async (
    { profileId, status }: { profileId: string; status: ProfileStatus },
    { rejectWithValue }
  ) => {
    try {
      const response = await profileApiService.updateProfileStatus(profileId, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile status');
    }
  }
);

/**
 * Profile slice
 */
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.validationErrors = null;
    },

    // Set validation errors
    setValidationErrors: (state, action: PayloadAction<ProfileValidationErrors>) => {
      state.validationErrors = action.payload;
      state.isValid = Object.keys(action.payload).length === 0;
    },

    // Clear validation errors
    clearValidationErrors: (state) => {
      state.validationErrors = null;
      state.isValid = true;
    },

    // Set form dirty state
    setFormDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    },

    // Reset profile state
    resetProfileState: () => initialState,

    // Update current profile locally (for optimistic updates)
    updateCurrentProfileLocal: (state, action: PayloadAction<Partial<Profile>>) => {
      if (state.currentProfile) {
        Object.assign(state.currentProfile, action.payload);
        state.isDirty = true;
      }
    },

    // Clear profiles list
    clearProfilesList: (state) => {
      state.profiles = [];
      state.profilesError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch current profile
    builder
      .addCase(fetchCurrentProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
        state.lastFetchedAt = new Date().toISOString();
        state.isDirty = false;
      })
      .addCase(fetchCurrentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch profile by ID
    builder
      .addCase(fetchProfileById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.isLoading = false;
        // If it's the current user's profile, update currentProfile
        if (state.currentProfile?.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create profile
    builder
      .addCase(createProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
        state.isDirty = false;
        state.lastFetchedAt = new Date().toISOString();
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
        state.validationErrors = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.currentProfile = action.payload;
        state.isDirty = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete profile
    builder
      .addCase(deleteProfile.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.isDeleting = false;
        state.currentProfile = null;
        state.isDirty = false;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });

    // Search profiles
    builder
      .addCase(searchProfiles.pending, (state) => {
        state.profilesLoading = true;
        state.profilesError = null;
      })
      .addCase(searchProfiles.fulfilled, (state, action) => {
        state.profilesLoading = false;
        state.profiles = action.payload;
      })
      .addCase(searchProfiles.rejected, (state, action) => {
        state.profilesLoading = false;
        state.profilesError = action.payload as string;
      });

    // Upload avatar
    builder
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.currentProfile && state.currentProfile.id === action.payload.profileId) {
          state.currentProfile.avatar = action.payload.url;
        }
      });

    // Upload resume
    builder
      .addCase(uploadResume.fulfilled, (state, action) => {
        if (state.currentProfile && 
            state.currentProfile.id === action.payload.profileId &&
            state.currentProfile.role === 'job_seeker') {
          if (!state.currentProfile.jobSeekerData.resume) {
            state.currentProfile.jobSeekerData.resume = {
              filename: '',
              url: action.payload.url,
              uploadedAt: new Date().toISOString(),
            };
          } else {
            state.currentProfile.jobSeekerData.resume.url = action.payload.url;
            state.currentProfile.jobSeekerData.resume.uploadedAt = new Date().toISOString();
          }
        }
      });

    // Add work experience, education, projects, certifications
    builder
      .addCase(addWorkExperience.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(updateWorkExperience.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(deleteWorkExperience.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(addEducation.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(addCertification.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      })
      .addCase(updateProfileStatus.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
      });
  },
});

// Export actions
export const {
  clearError,
  setValidationErrors,
  clearValidationErrors,
  setFormDirty,
  resetProfileState,
  updateCurrentProfileLocal,
  clearProfilesList,
} = profileSlice.actions;

// Export reducer
export default profileSlice.reducer;

// Selectors
export const selectCurrentProfile = (state: { auth: any; profile: ProfileState }) => state.profile.currentProfile;
export const selectProfileLoading = (state: { auth: any; profile: ProfileState }) => state.profile.isLoading;
export const selectProfileUpdating = (state: { auth: any; profile: ProfileState }) => state.profile.isUpdating;
export const selectProfileError = (state: { auth: any; profile: ProfileState }) => state.profile.error;
export const selectProfileValidationErrors = (state: { auth: any; profile: ProfileState }) => state.profile.validationErrors;
export const selectProfileIsDirty = (state: { auth: any; profile: ProfileState }) => state.profile.isDirty;
export const selectProfileIsValid = (state: { auth: any; profile: ProfileState }) => state.profile.isValid;
export const selectProfiles = (state: { auth: any; profile: ProfileState }) => state.profile.profiles;
export const selectProfilesLoading = (state: { auth: any; profile: ProfileState }) => state.profile.profilesLoading;
