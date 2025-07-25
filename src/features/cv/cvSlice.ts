/**
 * CV Redux slice for state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  CVEntity,
  CVUploadRequest,
  CVUploadResponse,
  CVUpdateRequest,
  FileUploadProgress
} from './types/cv.types';
import { cvApiService } from '../../services/cv/cvApi';

/**
 * CV state interface
 */
interface CVState {
  cvs: CVEntity[];
  currentCV: CVEntity | null;
  totalElements: number;
  loading: boolean;
  uploading: boolean;
  uploadProgress: FileUploadProgress | null;
  error: string | null;
}

/**
 * Initial state
 */
const initialState: CVState = {
  cvs: [],
  currentCV: null,
  totalElements: 0,
  loading: false,
  uploading: false,
  uploadProgress: null,
  error: null
};

/**
 * Async thunks
 */

// Upload CV
export const uploadCV = createAsyncThunk<
  CVUploadResponse,
  CVUploadRequest,
  { rejectValue: string }
>(
  'cv/uploadCV',
  async (request, { rejectWithValue, dispatch }) => {
    try {
      const response = await cvApiService.uploadCV(request, (progress) => {
        dispatch(setUploadProgress(progress));
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload CV');
    }
  }
);

// Get my CVs
export const getMyCVs = createAsyncThunk<
  CVEntity[],
  void,
  { rejectValue: string }
>(
  'cv/getMyCVs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cvApiService.getMyCVs();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch CVs');
    }
  }
);

// Get CV by ID
export const getCVById = createAsyncThunk<
  CVEntity,
  number,
  { rejectValue: string }
>(
  'cv/getCVById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await cvApiService.getCVById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch CV');
    }
  }
);

// Update CV
export const updateCV = createAsyncThunk<
  CVEntity,
  CVUpdateRequest,
  { rejectValue: string }
>(
  'cv/updateCV',
  async (request, { rejectWithValue }) => {
    try {
      const response = await cvApiService.updateCV(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update CV');
    }
  }
);

// Delete CV
export const deleteCV = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'cv/deleteCV',
  async (id, { rejectWithValue }) => {
    try {
      await cvApiService.deleteCV(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete CV');
    }
  }
);

/**
 * CV slice
 */
const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    setCurrentCV: (state, action: PayloadAction<CVEntity | null>) => {
      state.currentCV = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<FileUploadProgress | null>) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = null;
    },
    resetCVState: () => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Upload CV
      .addCase(uploadCV.pending, (state) => {
        state.uploading = true;
        state.error = null;
      })
      .addCase(uploadCV.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadProgress = null;
        // Add new CV to the beginning of the list
        state.cvs.unshift(action.payload as CVEntity);
        state.totalElements = state.cvs.length;
      })
      .addCase(uploadCV.rejected, (state, action) => {
        state.uploading = false;
        state.uploadProgress = null;
        state.error = action.payload || 'Upload failed';
      })
      
      // Get my CVs
      .addCase(getMyCVs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyCVs.fulfilled, (state, action) => {
        state.loading = false;
        state.cvs = action.payload;
        state.totalElements = action.payload.length;
      })
      .addCase(getMyCVs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch CVs';
      })
      
      // Get CV by ID
      .addCase(getCVById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCVById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCV = action.payload;
      })
      .addCase(getCVById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch CV';
      })
      
      // Update CV
      .addCase(updateCV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCV.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cvs.findIndex((cv: CVEntity) => cv.id === action.payload.id);
        if (index !== -1) {
          state.cvs[index] = action.payload;
        }
        if (state.currentCV && state.currentCV.id === action.payload.id) {
          state.currentCV = action.payload;
        }
      })
      .addCase(updateCV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update CV';
      })
      
      // Delete CV
      .addCase(deleteCV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCV.fulfilled, (state, action) => {
        state.loading = false;
        state.cvs = state.cvs.filter((cv: CVEntity) => cv.id !== action.payload);
        state.totalElements = state.cvs.length;
        if (state.currentCV && state.currentCV.id === action.payload) {
          state.currentCV = null;
        }
      })
      .addCase(deleteCV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete CV';
      });
  }
});

export const {
  setCurrentCV,
  setUploadProgress,
  clearError,
  clearUploadProgress,
  resetCVState
} = cvSlice.actions;

export default cvSlice.reducer;
