/**
 * Job application related type definitions
 */

/**
 * Application status constants matching backend
 */
export const ApplicationStatus = {
  PENDING: 'PENDING',
  REVIEWED: 'REVIEWED',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEW_SCHEDULED: 'INTERVIEW_SCHEDULED',
  INTERVIEW_COMPLETED: 'INTERVIEW_COMPLETED',
  OFFERED: 'OFFERED',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN'
} as const;

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus];

/**
 * Job application entity structure (from backend)
 */
export interface JobApplicationEntity {
  id: number;
  job: {
    id: number;
    title: string;
    companyName?: string;
    location: string;
    type: string;
    minSalary: number;
    maxSalary: number;
  };
  applicant: {
    id: number;
    email: string;
    fullName: string;
    // Add other applicant fields as needed
  };
  appliedDate: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  notes?: string;
  lastUpdated: string;
}

/**
 * Job application response DTO (from backend)
 */
export interface JobApplicationResponse {
  id: number;
  job: {
    id: number;
    title: string;
    companyName?: string;
    location: string;
    type: string;
    minSalary: number;
    maxSalary: number;
  };
  applicant: {
    id: number;
    email: string;
    fullName: string;
  };
  appliedDate: string;
  status: ApplicationStatus;
  coverLetter?: string;
  resumeUrl?: string;
  notes?: string;
  lastUpdated: string;
}

/**
 * Job application request DTO (for backend)
 */
export interface JobApplicationRequest {
  jobId: number;
  coverLetter?: string;
  resumeUrl?: string;
}

/**
 * Job application form values (for forms)
 */
export interface JobApplicationFormValues {
  coverLetter: string;
  resumeFile?: File;
  resumeUrl?: string;
}

/**
 * Job application search parameters
 */
export interface JobApplicationSearchParams {
  status?: ApplicationStatus;
  jobTitle?: string;
  companyName?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}

/**
 * Job application pagination response
 */
export interface JobApplicationPageResponse {
  content: JobApplicationResponse[];
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
 * Job application API error response
 */
export interface JobApplicationApiError {
  error: string;
  message?: string;
  timestamp?: string;
}

/**
 * Job application statistics (for job seeker dashboard)
 */
export interface JobApplicationStatistics {
  totalApplications: number;
  pendingApplications: number;
  reviewedApplications: number;
  shortlistedApplications: number;
  interviewsScheduled: number;
  offersReceived: number;
  rejectedApplications: number;
}

/**
 * Application status options for form selects
 */
export const APPLICATION_STATUS_OPTIONS = [
  { value: ApplicationStatus.PENDING, label: 'Pending', color: 'yellow' },
  { value: ApplicationStatus.REVIEWED, label: 'Reviewed', color: 'blue' },
  { value: ApplicationStatus.SHORTLISTED, label: 'Shortlisted', color: 'purple' },
  { value: ApplicationStatus.INTERVIEW_SCHEDULED, label: 'Interview Scheduled', color: 'indigo' },
  { value: ApplicationStatus.INTERVIEW_COMPLETED, label: 'Interview Completed', color: 'cyan' },
  { value: ApplicationStatus.OFFERED, label: 'Offered', color: 'green' },
  { value: ApplicationStatus.ACCEPTED, label: 'Accepted', color: 'emerald' },
  { value: ApplicationStatus.REJECTED, label: 'Rejected', color: 'red' },
  { value: ApplicationStatus.WITHDRAWN, label: 'Withdrawn', color: 'gray' }
];

/**
 * Get color class based on application status
 */
export const getApplicationStatusColor = (status: ApplicationStatus): string => {
  const statusOption = APPLICATION_STATUS_OPTIONS.find(option => option.value === status);
  return statusOption?.color || 'gray';
};

/**
 * Check if user can withdraw application
 */
export const canWithdrawApplication = (status: ApplicationStatus): boolean => {
  return [
    ApplicationStatus.PENDING,
    ApplicationStatus.REVIEWED,
    ApplicationStatus.SHORTLISTED,
    ApplicationStatus.INTERVIEW_SCHEDULED
  ].includes(status as any);
};

/**
 * Check if application is in active status
 */
export const isActiveApplication = (status: ApplicationStatus): boolean => {
  return ![
    ApplicationStatus.REJECTED,
    ApplicationStatus.WITHDRAWN,
    ApplicationStatus.ACCEPTED
  ].includes(status as any);
};
