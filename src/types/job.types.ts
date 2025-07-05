/**
 * Job management related type definitions
 */

/**
 * Job types constants matching backend
 */
export const JobType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  TEMPORARY: 'TEMPORARY',
  INTERNSHIP: 'INTERNSHIP',
  FREELANCE: 'FREELANCE'
} as const;

export type JobType = typeof JobType[keyof typeof JobType];

/**
 * Job status constants matching backend
 */
export const JobStatus = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  DRAFT: 'DRAFT'
} as const;

export type JobStatus = typeof JobStatus[keyof typeof JobStatus];

/**
 * Job entity structure (from backend)
 */
export interface JobEntity {
  id: number;
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  type: JobType;
  employer: {
    id: number;
    email: string;
    // Add other employer fields as needed
  };
  postedDate: string;
  requiredSkills: string[];
  requiredExperience: number;
  applicationDeadline: string;
  status: JobStatus;
}

/**
 * Job response DTO (from backend)
 */
export interface JobResponse {
  id: number;
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  type: JobType;
  employer: {
    id: number;
    email: string;
    // Add other employer fields as needed
  };
  postedDate: string;
  requiredSkills: string[];
  requiredExperience: number;
  applicationDeadline: string;
  status: JobStatus;
}

/**
 * Job request DTO (for backend)
 */
export interface JobRequest {
  title: string;
  description: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  type: JobType;
  requiredSkills: string[];
  requiredExperience: number;
  applicationDeadline: string;
  status: JobStatus;
}

/**
 * Job form values (for forms)
 */
export interface JobFormValues {
  title: string;
  description: string;
  location: string;
  minSalary: string | number;
  maxSalary: string | number;
  type: JobType;
  requiredSkills: string[];
  requiredExperience: string | number;
  applicationDeadline: string;
  status: JobStatus;
}

/**
 * Job search parameters
 */
export interface JobSearchParams {
  keyword?: string;
  location?: string;
  minSalary?: number;
  maxSalary?: number;
  type?: JobType;
  page?: number;
  size?: number;
}

/**
 * Job pagination response
 */
export interface JobPageResponse {
  content: JobResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Job API error response
 */
export interface JobApiError {
  error: string;
  message?: string;
  timestamp?: string;
}

/**
 * Job statistics (for employer dashboard)
 */
export interface JobStatistics {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  draftJobs: number;
  totalApplications: number;
}

/**
 * Job type options for form selects
 */
export const JOB_TYPE_OPTIONS = [
  { value: JobType.FULL_TIME, label: 'Full Time' },
  { value: JobType.PART_TIME, label: 'Part Time' },
  { value: JobType.CONTRACT, label: 'Contract' },
  { value: JobType.TEMPORARY, label: 'Temporary' },
  { value: JobType.INTERNSHIP, label: 'Internship' },
  { value: JobType.FREELANCE, label: 'Freelance' }
];

/**
 * Job status options for form selects
 */
export const JOB_STATUS_OPTIONS = [
  { value: JobStatus.OPEN, label: 'Open' },
  { value: JobStatus.CLOSED, label: 'Closed' },
  { value: JobStatus.DRAFT, label: 'Draft' }
];
