/**
 * Job Application API service
 */

import { api } from './api';
import type { 
  JobApplicationResponse, 
  JobApplicationRequest, 
  JobApplicationPageResponse, 
  JobApplicationSearchParams,
  JobApplicationStatistics
} from '../types/application.types';

/**
 * Job Application API endpoints
 */
const APPLICATION_ENDPOINTS = {
  APPLICATIONS: '/applications',
  APPLICATION_BY_ID: (id: number) => `/applications/${id}`,
  MY_APPLICATIONS: '/applications/my-applications',
  APPLY_FOR_JOB: (jobId: number) => `/applications/apply/${jobId}`,
  WITHDRAW_APPLICATION: (id: number) => `/applications/${id}/withdraw`,
  APPLICATION_STATISTICS: '/applications/statistics',
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
      params: { page, size }
    });
    return response.data;
  }

  /**
   * Get application by ID
   */
  static async getApplicationById(id: number): Promise<JobApplicationResponse> {
    const response = await api.get<JobApplicationResponse>(APPLICATION_ENDPOINTS.APPLICATION_BY_ID(id));
    return response.data;
  }

  /**
   * Apply for a job (requires JOB_SEEKER role)
   */
  static async applyForJob(jobId: number, applicationData: JobApplicationRequest): Promise<JobApplicationResponse> {
    const response = await api.post<JobApplicationResponse>(
      APPLICATION_ENDPOINTS.APPLY_FOR_JOB(jobId), 
      applicationData
    );
    return response.data;
  }

  /**
   * Get current user's applications (requires JOB_SEEKER role)
   */
  static async getMyApplications(): Promise<JobApplicationResponse[]> {
    const response = await api.get<JobApplicationResponse[]>(APPLICATION_ENDPOINTS.MY_APPLICATIONS);
    return response.data;
  }

  /**
   * Withdraw application (requires JOB_SEEKER role)
   */
  static async withdrawApplication(id: number): Promise<void> {
    await api.put(APPLICATION_ENDPOINTS.WITHDRAW_APPLICATION(id));
  }

  /**
   * Get application statistics for current user
   */
  static async getApplicationStatistics(): Promise<JobApplicationStatistics> {
    const response = await api.get<JobApplicationStatistics>(APPLICATION_ENDPOINTS.APPLICATION_STATISTICS);
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
      params
    });
    return response.data;
  }

  /**
   * Check if user has already applied for a job
   */
  static async hasAppliedForJob(jobId: number): Promise<boolean> {
    try {
      const response = await api.get<{ hasApplied: boolean }>(`/applications/check/${jobId}`);
      return response.data.hasApplied;
    } catch (error) {
      // If endpoint doesn't exist, fall back to checking my applications
      const myApplications = await this.getMyApplications();
      return myApplications.some(app => app.job.id === jobId);
    }
  }

  /**
   * Get applications for a specific job (employer only)
   */
  static async getJobApplications(jobId: number, page: number = 0, size: number = 10): Promise<JobApplicationPageResponse> {
    const response = await api.get<JobApplicationPageResponse>(`/jobs/${jobId}/applications`, {
      params: { page, size }
    });
    return response.data;
  }

  /**
   * Update application status (employer only)
   */
  static async updateApplicationStatus(id: number, status: string, notes?: string): Promise<JobApplicationResponse> {
    const response = await api.put<JobApplicationResponse>(
      APPLICATION_ENDPOINTS.APPLICATION_BY_ID(id),
      { status, notes }
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
  getApplicationStatistics: JobApplicationAPI.getApplicationStatistics,
  searchApplications: JobApplicationAPI.searchApplications,
  hasAppliedForJob: JobApplicationAPI.hasAppliedForJob,
  getJobApplications: JobApplicationAPI.getJobApplications,
  updateApplicationStatus: JobApplicationAPI.updateApplicationStatus,
};
