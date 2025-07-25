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
  console.log('ProfileSlice: Converting backend profile to legacy format:', backendProfile);
  
  // Validate required fields
  if (!backendProfile) {
    throw new Error('ProfileSlice: Backend profile is null or undefined');
  }
  
  if (!backendProfile.fullName) {
    throw new Error('ProfileSlice: Backend profile missing required fullName field');
  }
  
  // Log warning if userId is missing but don't throw error
  // Note: Backend doesn't provide userId field - this is expected behavior
  // We'll use the profile id instead for internal tracking
  
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

  console.log('ProfileSlice: Base profile created:', baseProfile);

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
  } else if (backendProfile.profileType === 'EMPLOYER') {
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
  } else if (backendProfile.profileType === 'ADMIN') {
    return {
      ...baseProfile,
      role: 'admin' as const,
      phone: backendProfile.phone || undefined,
      location: backendProfile.address || undefined,
      title: backendProfile.title || undefined,
      bio: backendProfile.summary || undefined,
    };
  } else {
    // Fallback case if type isn't recognized
    console.warn('ProfileSlice: Unrecognized profile type:', backendProfile.profileType);
    return {
      ...baseProfile,
      role: 'jobseeker' as const, // Default to jobseeker as fallback
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

export const fetchMyProfile = createAsyncThunk(
  'profile/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getMyProfile();
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
      console.log('ProfileSlice: Creating profile with request:', request);
      const response = await profileApi.createLegacyProfile(request);
      console.log('ProfileSlice: Create profile response:', response);
      
      if (response.success && response.profile) {
        console.log('ProfileSlice: Profile created successfully, converting to legacy format...');
        const convertedProfile = convertBackendToLegacyProfile(response.profile);
        console.log('ProfileSlice: Converted profile:', convertedProfile);
        return convertedProfile;
      }
      
      console.error('ProfileSlice: Create profile failed:', response);
      throw new Error(response.message || 'Failed to create profile');
    } catch (error: any) {
      console.error('ProfileSlice: Create profile error:', error);
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
      
      // Fetch My Profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
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
