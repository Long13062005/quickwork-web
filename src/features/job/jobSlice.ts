/**
 * Job Redux slice for state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  JobResponse, 
  JobRequest, 
  JobSearchParams,
  JobEntity
} from '../../types/job.types';
import { jobAPI } from '../../services/job';

/**
 * Utility function to convert JobEntity to JobResponse format
 */
const convertJobEntityToResponse = (entity: JobEntity): JobResponse => {
  return {
    id: entity.id,
    title: entity.title,
    description: entity.description,
    location: entity.location,
    minSalary: entity.minSalary,
    maxSalary: entity.maxSalary,
    type: entity.type,
    employer: entity.employer,
    postedDate: entity.postedDate,
    requiredSkills: entity.requiredSkills,
    requiredExperience: entity.requiredExperience,
    applicationDeadline: entity.applicationDeadline,
    status: entity.status,
  };
};

/**
 * Job state interface
 */
interface JobState {
  jobs: JobResponse[];
  currentJob: JobResponse | null;
  myJobs: JobResponse[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  searchParams: JobSearchParams;
}

/**
 * Initial state
 */
const initialState: JobState = {
  jobs: [],
  currentJob: null,
  myJobs: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
  loading: false,
  error: null,
  searchParams: {}
};

/**
 * Async thunks
 */

// Get all jobs
export const fetchJobs = createAsyncThunk(
  'job/fetchJobs',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}) => {
    const response = await jobAPI.getAllJobs(page, size);
    return response;
  }
);

// Get job by ID
export const fetchJobById = createAsyncThunk(
  'job/fetchJobById',
  async (id: number, { rejectWithValue }) => {
    try {
      // Validate the ID before making the API call
      if (!Number.isInteger(id) || id <= 0 || isNaN(id)) {
        throw new Error(`Invalid job ID: ${id}`);
      }
      const response = await jobAPI.getJobById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch job');
    }
  }
);

// Create job
export const createJob = createAsyncThunk(
  'job/createJob',
  async (jobData: JobRequest, { rejectWithValue }) => {
    try {
      const response = await jobAPI.createJob(jobData);
      return response;
    } catch (error: any) {
      // Handle backend error response format
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message || 'Failed to create job');
    }
  }
);

// Update job
export const updateJob = createAsyncThunk(
  'job/updateJob',
  async ({ id, jobData }: { id: number; jobData: JobRequest }, { rejectWithValue }) => {
    try {
      // Validate the ID before making the API call
      if (!Number.isInteger(id) || id <= 0 || isNaN(id)) {
        throw new Error(`Invalid job ID: ${id}`);
      }
      const response = await jobAPI.updateJob(id, jobData);
      return response;
    } catch (error: any) {
      // Handle backend error response format
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message || 'Failed to update job');
    }
  }
);

// Delete job
export const deleteJob = createAsyncThunk(
  'job/deleteJob',
  async (id: number, { rejectWithValue }) => {
    try {
      // Validate the ID before making the API call
      if (!Number.isInteger(id) || id <= 0 || isNaN(id)) {
        throw new Error(`Invalid job ID: ${id}`);
      }
      await jobAPI.deleteJob(id);
      return id;
    } catch (error: any) {
      // Handle backend error response format
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message || 'Failed to delete job');
    }
  }
);

// Search jobs
export const searchJobs = createAsyncThunk(
  'job/searchJobs',
  async ({ keyword, page = 0, size = 10 }: { keyword: string; page?: number; size?: number }) => {
    const response = await jobAPI.searchJobs(keyword, page, size);
    // Convert JobEntity content to JobResponse format for consistency
    const convertedContent = response.content.map(convertJobEntityToResponse);
    return {
      ...response,
      content: convertedContent
    };
  }
);

// Get my jobs (employer)
export const fetchMyJobs = createAsyncThunk(
  'job/fetchMyJobs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await jobAPI.getJobsByEmployer();
      return response;
    } catch (error: any) {
      // Handle backend error response format
      if (error.response?.data?.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message || 'Failed to fetch your jobs');
    }
  }
);

// Advanced search
export const searchJobsAdvanced = createAsyncThunk(
  'job/searchJobsAdvanced',
  async (searchParams: JobSearchParams) => {
    const response = await jobAPI.searchJobsAdvanced(searchParams);
    return response;
  }
);

/**
 * Job slice
 */
const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    setSearchParams: (state, action: PayloadAction<JobSearchParams>) => {
      state.searchParams = action.payload;
    },
    clearSearchParams: (state) => {
      state.searchParams = {};
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch jobs';
      })
      
      // Fetch job by ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch job';
      })
      
      // Create job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.unshift(action.payload);
        state.myJobs.unshift(action.payload);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to create job';
      })
      
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        const updatedJob = action.payload;
        
        // Update in jobs array
        const jobIndex = state.jobs.findIndex(job => job.id === updatedJob.id);
        if (jobIndex !== -1) {
          state.jobs[jobIndex] = updatedJob;
        }
        
        // Update in myJobs array
        const myJobIndex = state.myJobs.findIndex(job => job.id === updatedJob.id);
        if (myJobIndex !== -1) {
          state.myJobs[myJobIndex] = updatedJob;
        }
        
        // Update current job if it's the same
        if (state.currentJob?.id === updatedJob.id) {
          state.currentJob = updatedJob;
        }
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to update job';
      })
      
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        const deletedJobId = action.payload;
        
        // Remove from jobs array
        state.jobs = state.jobs.filter(job => job.id !== deletedJobId);
        
        // Remove from myJobs array
        state.myJobs = state.myJobs.filter(job => job.id !== deletedJobId);
        
        // Clear current job if it's the deleted one
        if (state.currentJob?.id === deletedJobId) {
          state.currentJob = null;
        }
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to delete job';
      })
      
      // Search jobs
      .addCase(searchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(searchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search jobs';
      })
      
      // Fetch my jobs
      .addCase(fetchMyJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.myJobs = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || action.error.message || 'Failed to fetch my jobs';
      })
      
      // Advanced search
      .addCase(searchJobsAdvanced.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchJobsAdvanced.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(searchJobsAdvanced.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search jobs';
      });
  }
});

export const { 
  clearError, 
  clearCurrentJob, 
  setSearchParams, 
  clearSearchParams,
  setCurrentPage,
  setPageSize 
} = jobSlice.actions;

export default jobSlice.reducer;
