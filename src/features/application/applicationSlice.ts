/**
 * Job Application Redux slice for state management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { 
  ApplicationEntity,
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
  applications: ApplicationEntity[];
  currentApplication: ApplicationEntity | null;
  myApplications: ApplicationEntity[];
  statistics: JobApplicationStatistics | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  searchParams: JobApplicationSearchParams;
  appliedJobs: number[]; // Track which jobs user has applied to - changed from Set to array
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
  appliedJobs: [],
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

/**
 * Apply to job with CV upload (new API)
 */
export const applyToJobWithCV = createAsyncThunk(
  'jobApplication/applyToJobWithCV',
  async ({ jobId, data }: { jobId: number; data: { coverLetter?: string; cvFile?: File } }, { rejectWithValue }) => {
    try {
      const response = await jobApplicationAPI.applyToJob(jobId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply to job');
    }
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
    const response = await jobApplicationAPI.getApplicationsByJob(jobId);
    return {
      content: response,
      totalPages: 1,
      totalElements: response.length,
      size,
      number: page,
      numberOfElements: response.length,
      first: page === 0,
      last: true,
      empty: response.length === 0
    };
  }
);

/**
 * Get applications by job ID (for employers)
 */
export const fetchApplicationsByJobId = createAsyncThunk(
  'jobApplication/fetchApplicationsByJobId',
  async (jobId: number, { rejectWithValue }) => {
    try {
      const response = await jobApplicationAPI.getApplicationsByJob(jobId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch job applications');
    }
  }
);

/**
 * Update application status (for employers)
 */
export const updateJobApplicationStatus = createAsyncThunk(
  'jobApplication/updateStatus',
  async ({ applicationId, status }: { applicationId: number; status: ApplicationStatus }, { rejectWithValue }) => {
    try {
      const response = await jobApplicationAPI.updateApplicationStatus(applicationId, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update application status');
    }
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
      if (!state.appliedJobs.includes(action.payload)) {
        state.appliedJobs.push(action.payload);
      }
    },
    removeAppliedJob: (state, action: PayloadAction<number>) => {
      state.appliedJobs = state.appliedJobs.filter(jobId => jobId !== action.payload);
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
        const jobId = action.payload.jobId;
        if (!state.appliedJobs.includes(jobId)) {
          state.appliedJobs.push(jobId);
        }
      })
      .addCase(applyForJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to apply for job';
      })
      
      // Apply to job with CV upload
      .addCase(applyToJobWithCV.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyToJobWithCV.fulfilled, (state, action) => {
        state.loading = false;
        // ApplicationEntity is returned directly from backend
        const application = action.payload;
        state.myApplications.unshift(application);
        const jobId = application.jobId;
        if (!state.appliedJobs.includes(jobId)) {
          state.appliedJobs.push(jobId);
        }
      })
      .addCase(applyToJobWithCV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to apply to job';
      })
      
      // Fetch my applications
      .addCase(fetchMyApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.myApplications = action.payload;
        // Update applied jobs array
        state.appliedJobs = action.payload.map(app => app.jobId);
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
          state.appliedJobs = state.appliedJobs.filter(jobId => jobId !== withdrawnApp.jobId);
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
          if (!state.appliedJobs.includes(jobId)) {
            state.appliedJobs.push(jobId);
          }
        } else {
          state.appliedJobs = state.appliedJobs.filter(id => id !== jobId);
        }
      })
      
      // Fetch job applications (employer)
      .addCase(fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        // Convert ApplicationEntity[] to JobApplicationResponse[]
        state.applications = action.payload.content.map((app: any) => ({
          id: app.id,
          job: {
            id: app.jobId || app.job?.id || 0,
            title: app.job?.title || 'Unknown Job',
            companyName: app.job?.company || 'Unknown Company',
            location: app.job?.location || 'Unknown Location',
            type: app.job?.type || 'Unknown Type',
            minSalary: app.job?.minSalary || 0,
            maxSalary: app.job?.maxSalary || 0,
          },
          applicant: {
            id: app.userId || app.user?.id || 0,
            email: app.user?.email || 'unknown@example.com',
            fullName: app.user ? 
              `${app.user.firstName} ${app.user.lastName}` : 
              'Unknown User',
          },
          appliedDate: app.appliedAt || new Date().toISOString(),
          status: app.status,
          coverLetter: app.coverLetter,
          resumeUrl: app.cvFileUrl,
          lastUpdated: app.appliedAt || new Date().toISOString(),
        }));
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
      .addCase(updateJobApplicationStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJobApplicationStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedApplication = action.payload;
        
        // Convert ApplicationEntity to JobApplicationResponse format
        const jobApplicationResponse: JobApplicationResponse = {
          id: updatedApplication.id,
          job: {
            id: updatedApplication.jobId,
            title: updatedApplication.job?.title || 'Unknown Job',
            companyName: updatedApplication.job?.company || 'Unknown Company',
            location: updatedApplication.job?.location || 'Unknown Location',
            type: updatedApplication.job?.type || 'Unknown Type',
            minSalary: updatedApplication.job?.minSalary || 0,
            maxSalary: updatedApplication.job?.maxSalary || 0,
          },
          applicant: {
            id: updatedApplication.userId,
            email: updatedApplication.user?.email || 'unknown@example.com',
            fullName: updatedApplication.user ? 
              `${updatedApplication.user.firstName} ${updatedApplication.user.lastName}` : 
              'Unknown User',
          },
          appliedDate: updatedApplication.appliedAt,
          status: updatedApplication.status,
          coverLetter: updatedApplication.coverLetter,
          resumeUrl: updatedApplication.cvFileUrl,
          lastUpdated: updatedApplication.appliedAt,
        };
        
        // Update in applications array
        const appIndex = state.applications.findIndex(app => app.id === updatedApplication.id);
        if (appIndex !== -1) {
          state.applications[appIndex] = jobApplicationResponse;
        }
        
        // Update current application if it's the same
        if (state.currentApplication?.id === updatedApplication.id) {
          state.currentApplication = jobApplicationResponse;
        }
      })
      .addCase(updateJobApplicationStatus.rejected, (state, action) => {
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
