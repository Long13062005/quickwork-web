/**
 * Job Application Redux slice for state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  JobApplicationResponse, 
  JobApplicationRequest, 
  JobApplicationSearchParams,
  JobApplicationStatistics,
  ApplicationStatus
} from '../../types/application.types';
import { jobApplicationAPI } from '../../services/application';

/**
 * Job Application state interface
 */
interface JobApplicationState {
  applications: JobApplicationResponse[];
  currentApplication: JobApplicationResponse | null;
  myApplications: JobApplicationResponse[];
  statistics: JobApplicationStatistics | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  searchParams: JobApplicationSearchParams;
  appliedJobs: Set<number>; // Track which jobs user has applied to
}

/**
 * Initial state
 */
const initialState: JobApplicationState = {
  applications: [],
  currentApplication: null,
  myApplications: [],
  statistics: null,
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  pageSize: 10,
  loading: false,
  error: null,
  searchParams: {},
  appliedJobs: new Set(),
};

/**
 * Async thunks
 */

// Get all applications (admin/employer)
export const fetchAllApplications = createAsyncThunk(
  'jobApplication/fetchAllApplications',
  async ({ page = 0, size = 10 }: { page?: number; size?: number } = {}) => {
    const response = await jobApplicationAPI.getAllApplications(page, size);
    return response;
  }
);

// Get application by ID
export const fetchApplicationById = createAsyncThunk(
  'jobApplication/fetchApplicationById',
  async (id: number) => {
    const response = await jobApplicationAPI.getApplicationById(id);
    return response;
  }
);

// Apply for a job
export const applyForJob = createAsyncThunk(
  'jobApplication/applyForJob',
  async ({ jobId, applicationData }: { jobId: number; applicationData: JobApplicationRequest }) => {
    const response = await jobApplicationAPI.applyForJob(jobId, applicationData);
    return { ...response, jobId };
  }
);

// Get my applications
export const fetchMyApplications = createAsyncThunk(
  'jobApplication/fetchMyApplications',
  async () => {
    const response = await jobApplicationAPI.getMyApplications();
    return response;
  }
);

// Withdraw application
export const withdrawApplication = createAsyncThunk(
  'jobApplication/withdrawApplication',
  async (id: number) => {
    await jobApplicationAPI.withdrawApplication(id);
    return id;
  }
);

// Get application statistics
export const fetchApplicationStatistics = createAsyncThunk(
  'jobApplication/fetchApplicationStatistics',
  async () => {
    const response = await jobApplicationAPI.getApplicationStatistics();
    return response;
  }
);

// Search applications
export const searchApplications = createAsyncThunk(
  'jobApplication/searchApplications',
  async (searchParams: JobApplicationSearchParams) => {
    const response = await jobApplicationAPI.searchApplications(searchParams);
    return response;
  }
);

// Check if applied for job
export const checkApplicationStatus = createAsyncThunk(
  'jobApplication/checkApplicationStatus',
  async (jobId: number) => {
    const hasApplied = await jobApplicationAPI.hasAppliedForJob(jobId);
    return { jobId, hasApplied };
  }
);

// Get job applications (employer)
export const fetchJobApplications = createAsyncThunk(
  'jobApplication/fetchJobApplications',
  async ({ jobId, page = 0, size = 10 }: { jobId: number; page?: number; size?: number }) => {
    const response = await jobApplicationAPI.getJobApplications(jobId, page, size);
    return response;
  }
);

// Update application status (employer)
export const updateApplicationStatus = createAsyncThunk(
  'jobApplication/updateApplicationStatus',
  async ({ id, status, notes }: { id: number; status: ApplicationStatus; notes?: string }) => {
    const response = await jobApplicationAPI.updateApplicationStatus(id, status, notes);
    return response;
  }
);

/**
 * Job Application slice
 */
const jobApplicationSlice = createSlice({
  name: 'jobApplication',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentApplication: (state) => {
      state.currentApplication = null;
    },
    setSearchParams: (state, action: PayloadAction<JobApplicationSearchParams>) => {
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
    },
    addAppliedJob: (state, action: PayloadAction<number>) => {
      state.appliedJobs.add(action.payload);
    },
    removeAppliedJob: (state, action: PayloadAction<number>) => {
      state.appliedJobs.delete(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all applications
      .addCase(fetchAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch applications';
      })
      
      // Fetch application by ID
      .addCase(fetchApplicationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentApplication = action.payload;
      })
      .addCase(fetchApplicationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch application';
      })
      
      // Apply for job
      .addCase(applyForJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyForJob.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications.unshift(action.payload);
        state.appliedJobs.add(action.payload.jobId);
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to apply for job';
      })
      
      // Fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
        // Update applied jobs set
        state.appliedJobs = new Set(action.payload.map(app => app.job.id));
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch my applications';
      })
      
      // Withdraw application
      .addCase(withdrawApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(withdrawApplication.fulfilled, (state, action) => {
        state.loading = false;
        const withdrawnId = action.payload;
        
        // Remove from my applications
        const withdrawnApp = state.myApplications.find(app => app.id === withdrawnId);
        state.myApplications = state.myApplications.filter(app => app.id !== withdrawnId);
        
        // Remove from applied jobs if found
        if (withdrawnApp) {
          state.appliedJobs.delete(withdrawnApp.job.id);
        }
        
        // Clear current application if it's the withdrawn one
        if (state.currentApplication?.id === withdrawnId) {
          state.currentApplication = null;
        }
      })
      .addCase(withdrawApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to withdraw application';
      })
      
      // Fetch application statistics
      .addCase(fetchApplicationStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApplicationStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchApplicationStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch application statistics';
      })
      
      // Search applications
      .addCase(searchApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(searchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search applications';
      })
      
      // Check application status
      .addCase(checkApplicationStatus.fulfilled, (state, action) => {
        const { jobId, hasApplied } = action.payload;
        if (hasApplied) {
          state.appliedJobs.add(jobId);
        } else {
          state.appliedJobs.delete(jobId);
        }
      })
      
      // Fetch job applications (employer)
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.content;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.currentPage = action.payload.number;
        state.pageSize = action.payload.size;
      })
      .addCase(fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch job applications';
      })
      
      // Update application status (employer)
      .addCase(updateApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApplication = action.payload;
        
        // Update in applications array
        const appIndex = state.applications.findIndex(app => app.id === updatedApplication.id);
        if (appIndex !== -1) {
          state.applications[appIndex] = updatedApplication;
        }
        
        // Update current application if it's the same
        if (state.currentApplication?.id === updatedApplication.id) {
          state.currentApplication = updatedApplication;
        }
      })
      .addCase(updateApplicationStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update application status';
      });
  }
});

export const { 
  clearError, 
  clearCurrentApplication, 
  setSearchParams, 
  clearSearchParams,
  setCurrentPage,
  setPageSize,
  addAppliedJob,
  removeAppliedJob
} = jobApplicationSlice.actions;

export default jobApplicationSlice.reducer;
