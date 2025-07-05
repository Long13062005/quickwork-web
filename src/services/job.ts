/**
 * Job API service
 */

import { api } from './api';
import type { 
  JobResponse, 
  JobRequest, 
  JobPageResponse, 
  JobSearchParams
} from '../types/job.types';

/**
 * Job API endpoints
 */
const JOB_ENDPOINTS = {
  JOBS: '/jobs',
  JOB_BY_ID: (id: number) => `/jobs/${id}`,
  SEARCH: '/jobs/search',
  MY_JOBS: '/jobs/my-jobs',
  SEARCH_ADVANCED: '/jobs/search-advanced',
} as const;

/**
 * Job API service class
 */
export class JobAPI {
  /**
   * Get all jobs with pagination
   */
  static async getAllJobs(page: number = 0, size: number = 10): Promise<JobPageResponse> {
    const response = await api.get<JobPageResponse>(JOB_ENDPOINTS.JOBS, {
      params: { page, size }
    });
    return response.data;
  }

  /**
   * Get job by ID
   */
  static async getJobById(id: number): Promise<JobResponse> {
    const response = await api.get<JobResponse>(JOB_ENDPOINTS.JOB_BY_ID(id));
    return response.data;
  }

  /**
   * Create new job (requires EMPLOYER role)
   */
  static async createJob(jobData: JobRequest): Promise<JobResponse> {
    const response = await api.post<JobResponse>(JOB_ENDPOINTS.JOBS, jobData);
    return response.data;
  }

  /**
   * Update job (requires EMPLOYER role)
   */
  static async updateJob(id: number, jobData: JobRequest): Promise<JobResponse> {
    const response = await api.put<JobResponse>(JOB_ENDPOINTS.JOB_BY_ID(id), jobData);
    return response.data;
  }

  /**
   * Delete job (requires EMPLOYER role)
   */
  static async deleteJob(id: number): Promise<void> {
    await api.delete(JOB_ENDPOINTS.JOB_BY_ID(id));
  }

  /**
   * Search jobs by keyword
   */
  static async searchJobs(keyword: string, page: number = 0, size: number = 10): Promise<JobPageResponse> {
    const response = await api.get<JobPageResponse>(JOB_ENDPOINTS.SEARCH, {
      params: { keyword, page, size }
    });
    return response.data;
  }

  /**
   * Get jobs by current employer (requires EMPLOYER role)
   */
  static async getJobsByEmployer(): Promise<JobResponse[]> {
    const response = await api.get<JobResponse[]>(JOB_ENDPOINTS.MY_JOBS);
    return response.data;
  }

  /**
   * Advanced job search with filters
   */
  static async searchJobsAdvanced(searchParams: JobSearchParams): Promise<JobPageResponse> {
    const {
      keyword,
      location,
      minSalary,
      maxSalary,
      type,
      page = 0,
      size = 10
    } = searchParams;

    const params: Record<string, any> = { page, size };
    
    if (keyword) params.keyword = keyword;
    if (location) params.location = location;
    if (minSalary !== undefined) params.minSalary = minSalary;
    if (maxSalary !== undefined) params.maxSalary = maxSalary;
    if (type) params.type = type;

    const response = await api.get<JobPageResponse>(JOB_ENDPOINTS.SEARCH_ADVANCED, {
      params
    });
    return response.data;
  }
}

/**
 * Job API utility functions
 */
export const jobAPI = {
  getAllJobs: JobAPI.getAllJobs,
  getJobById: JobAPI.getJobById,
  createJob: JobAPI.createJob,
  updateJob: JobAPI.updateJob,
  deleteJob: JobAPI.deleteJob,
  searchJobs: JobAPI.searchJobs,
  getJobsByEmployer: JobAPI.getJobsByEmployer,
  searchJobsAdvanced: JobAPI.searchJobsAdvanced,
};
