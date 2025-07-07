import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { profileApi } from './api/profileApi';
import type { 
  Profile, 
  LegacyCreateProfileRequest, 
  LegacyUpdateProfileRequest,
  ProfileData
} from './types/profile.types';

// Helper function to convert ProfileData to legacy Profile format
const convertBackendToLegacyProfile = (backendProfile: ProfileData): Profile => {
  const fullNameParts = backendProfile.fullName.split(' ');
  const firstName = fullNameParts[0] || '';
  const lastName = fullNameParts.slice(1).join(' ') || '';
  
  const baseProfile = {
    id: backendProfile.id?.toString() || '',
    userId: backendProfile.id?.toString(), // Use profile id as userId since backend doesn't provide separate userId
    email: '', // Email not available in current ProfileData structure
    firstName,
    lastName,
    profilePicture: backendProfile.avatarUrl || undefined,
    createdAt: backendProfile.createdAt || new Date().toISOString(),
    updatedAt: backendProfile.updatedAt || new Date().toISOString(),
    isComplete: Boolean(backendProfile.fullName && backendProfile.title),
  };

  if (backendProfile.profileType === 'JOB_SEEKER') {
    return {
      ...baseProfile,
      role: 'jobseeker' as const,
      phone: backendProfile.phone || undefined,
      location: backendProfile.address || undefined,
      professionalTitle: backendProfile.title || undefined,
      experience: backendProfile.experiences?.join(', ') || undefined,
      skills: backendProfile.skills || undefined,
      bio: backendProfile.summary || undefined,
    };
  } else {
    return {
      ...baseProfile,
      role: 'employer' as const,
      companyName: backendProfile.companyName || '',
      phone: backendProfile.phone || undefined,
      companyLocation: backendProfile.address || undefined,
      industry: backendProfile.title || undefined, // Using title as industry for employers
      companyDescription: backendProfile.summary || undefined,
      companyWebsite: backendProfile.companyWebsite || undefined,
    };
  }
};

// Profile state interface
interface ProfileState {
  currentProfile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
}

// Initial state
const initialState: ProfileState = {
  currentProfile: null,
  profiles: [],
  loading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
};

// Async thunks
export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfile(userId);
      if (response) {
        return convertBackendToLegacyProfile(response);
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (request: LegacyCreateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await profileApi.createLegacyProfile(request);
      if (response.success && response.profile) {
        return convertBackendToLegacyProfile(response.profile);
      }
      throw new Error(response.message || 'Failed to create profile');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (request: LegacyUpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateLegacyProfile(request);
      if (response.success && response.profile) {
        return convertBackendToLegacyProfile(response.profile);
      }
      throw new Error(response.message || 'Failed to update profile');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const fetchProfiles = createAsyncThunk(
  'profile/fetchProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfiles();
      return response.profiles.map(convertBackendToLegacyProfile);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profiles');
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'profile/deleteProfile',
  async (profileId: string, { rejectWithValue }) => {
    try {
      const response = await profileApi.deleteProfile(profileId);
      if (response.success) {
        return profileId;
      }
      throw new Error(response.message || 'Failed to delete profile');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete profile');
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProfile: (state) => {
      state.currentProfile = null;
    },
    setCurrentProfile: (state, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create Profile
      .addCase(createProfile.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.isCreating = false;
        if (action.payload) {
          state.currentProfile = action.payload;
          state.profiles.push(action.payload);
        }
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        if (action.payload) {
          state.currentProfile = action.payload;
          const index = state.profiles.findIndex(p => p.id === action.payload!.id);
          if (index !== -1) {
            state.profiles[index] = action.payload;
          }
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      })
      
      // Fetch Profiles
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Profile
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = state.profiles.filter(p => p.id !== action.payload);
        if (state.currentProfile?.id === action.payload) {
          state.currentProfile = null;
        }
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentProfile, setCurrentProfile } = profileSlice.actions;
export default profileSlice.reducer;
