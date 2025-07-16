/**
 * Job Application API service
 */

import { api } from './api';
import type { 
  ApplicationEntity,
  JobApplicationRequest, 
  JobApplicationPageResponse, 
  JobApplicationSearchParams,
  JobApplicationStatistics,
  ApplicationStatus
} from '../types/application.types';

/**
 * Job Application API endpoints
 */
const APPLICATION_ENDPOINTS = {
  APPLICATIONS: '/applications',
  APPLICATION_BY_ID: (id: number) => `/applications/${id}`,
  MY_APPLICATIONS: '/applications/my-applications',
  APPLY_FOR_JOB: (jobId: number) => `/applications/apply/${jobId}`,
  JOB_APPLICATIONS: (jobId: number) => `/applications/job/${jobId}`,
  UPDATE_STATUS: (applicationId: number) => `/applications/${applicationId}/status`,
  DELETE_APPLICATION: (id: number) => `/applications/${id}`,
  WITHDRAW_BY_JOB_ID: (jobId: number) => `/applications/withdraw/job/${jobId}`,
  APPLICATION_STATISTICS: '/applications/statistics/my',
  SEARCH: '/applications/search',
} as const;

/**
 * Job Application API service class
 */
export class JobApplicationAPI {
  /**
   * Get all applications with pagination (admin/employer only)
   */
  static async getAllApplications(page: number = 0, size: number = 10): Promise<JobApplicationPageResponse> {
    const response = await api.get<JobApplicationPageResponse>(APPLICATION_ENDPOINTS.APPLICATIONS, {
      params: { page, size },
      withCredentials: true
    });
    return response.data;
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(id: number): Promise<ApplicationEntity> {
    const response = await api.get<ApplicationEntity>(APPLICATION_ENDPOINTS.APPLICATION_BY_ID(id), {
      withCredentials: true
    });
    return response.data;
  }

  /**
   * Apply for a job (requires JOB_SEEKER role)
   */
  static async applyForJob(jobId: number, applicationData: JobApplicationRequest): Promise<ApplicationEntity> {
    const response = await api.post<ApplicationEntity>(
      APPLICATION_ENDPOINTS.APPLY_FOR_JOB(jobId), 
      applicationData,
      {
        withCredentials: true
      }
    );
    return response.data;
  }

  /**
   * Get current user's applications (requires JOB_SEEKER role)
   */
  static async getMyApplications(): Promise<ApplicationEntity[]> {
    const response = await api.get<ApplicationEntity[]>(APPLICATION_ENDPOINTS.MY_APPLICATIONS, {
      withCredentials: true
    });
    return response.data;
  }

  /**
   * Withdraw application by job ID (requires USER role)
   */
  static async withdrawApplication(jobId: number): Promise<ApplicationEntity> {
    const response = await api.put<ApplicationEntity>(
      APPLICATION_ENDPOINTS.WITHDRAW_BY_JOB_ID(jobId),
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
    return response.data;
  }

  /**
   * Delete application by updating status to WITHDRAWN (requires USER or EMPLOYER role)
   */
  static async deleteApplication(id: number): Promise<ApplicationEntity> {
    const response = await api.put<ApplicationEntity>(
      APPLICATION_ENDPOINTS.UPDATE_STATUS(id), 
      'WITHDRAWN',
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
    return response.data;
  }

  /**
   * Get application statistics for current user
   */
  static async getApplicationStatistics(): Promise<JobApplicationStatistics> {
    const response = await api.get<JobApplicationStatistics>(APPLICATION_ENDPOINTS.APPLICATION_STATISTICS, {
      withCredentials: true
    });
    return response.data;
  }

  /**
   * Search applications with filters
   */
  static async searchApplications(searchParams: JobApplicationSearchParams): Promise<JobApplicationPageResponse> {
    const {
      status,
      jobTitle,
      companyName,
      dateFrom,
      dateTo,
      page = 0,
      size = 10
    } = searchParams;

    const params: Record<string, any> = { page, size };
    
    if (status) params.status = status;
    if (jobTitle) params.jobTitle = jobTitle;
    if (companyName) params.companyName = companyName;
    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;

    const response = await api.get<JobApplicationPageResponse>(APPLICATION_ENDPOINTS.SEARCH, {
      params,
      withCredentials: true
    });
    return response.data;
  }

  /**
   * Check if user has already applied for a job
   */
  static async hasAppliedForJob(jobId: number): Promise<boolean> {
    try {
      const response = await api.get<{ hasApplied: boolean }>(`/applications/check/${jobId}`, {
        withCredentials: true
      });
      return response.data.hasApplied;
    } catch (error) {
      // If endpoint doesn't exist, fall back to checking my applications
      const myApplications = await this.getMyApplications();
      return myApplications.some(app => app.jobId === jobId);
    }
  }

  /**
   * Apply to a job with CV upload (matching your backend API)
   */
  static async applyToJob(jobId: number, data: { coverLetter?: string; cvFile?: File }): Promise<ApplicationEntity> {
    const formData = new FormData();
    
    if (data.coverLetter) {
      formData.append('coverLetter', data.coverLetter);
    }
    
    if (data.cvFile) {
      formData.append('cvFile', data.cvFile);
    }

    const response = await api.post<ApplicationEntity>(
      APPLICATION_ENDPOINTS.APPLY_FOR_JOB(jobId), 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      }
    );
    return response.data;
  }

  /**
   * Get applications for a specific job (matching your backend API)
   */
  static async getApplicationsByJob(jobId: number): Promise<ApplicationEntity[]> {
    const response = await api.get<ApplicationEntity[]>(APPLICATION_ENDPOINTS.JOB_APPLICATIONS(jobId), {
      withCredentials: true
    });
    return response.data;
  }

  /**
   * Update application status (matching your backend API)
   */
  static async updateApplicationStatus(
    applicationId: number, 
    status: ApplicationStatus
  ): Promise<ApplicationEntity> {
    const response = await api.put<ApplicationEntity>(
      APPLICATION_ENDPOINTS.UPDATE_STATUS(applicationId), 
      status,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true
      }
    );
    return response.data;
  }
}

/**
 * Job Application API utility functions
 */
export const jobApplicationAPI = {
  getAllApplications: JobApplicationAPI.getAllApplications,
  getApplicationById: JobApplicationAPI.getApplicationById,
  applyForJob: JobApplicationAPI.applyForJob,
  getMyApplications: JobApplicationAPI.getMyApplications,
  withdrawApplication: JobApplicationAPI.withdrawApplication,
  deleteApplication: JobApplicationAPI.deleteApplication,
  getApplicationStatistics: JobApplicationAPI.getApplicationStatistics,
  searchApplications: JobApplicationAPI.searchApplications,
  hasAppliedForJob: JobApplicationAPI.hasAppliedForJob,
  updateApplicationStatus: JobApplicationAPI.updateApplicationStatus,
  applyToJob: JobApplicationAPI.applyToJob,
  getApplicationsByJob: JobApplicationAPI.getApplicationsByJob,
};
