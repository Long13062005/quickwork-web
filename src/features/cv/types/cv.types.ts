/**
 * CV Types - Aligned with backend CVEntity
 */

// CV Status enum matching backend
export const CVStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DELETED: 'DELETED'
} as const;

export type CVStatus = typeof CVStatus[keyof typeof CVStatus];

// CV Entity interface matching backend structure
export interface CVEntity {
  id: number;
  profileId: number;
  fileUrl: string;
  storageKey: string;
  originFilename: string;
  fileType: string;
  status: CVStatus;
  createdAt: string;
  updatedAt: string;
}

// CV upload request interface
export interface CVUploadRequest {
  file: File;
  label?: string; // Optional label
  description?: string; // Optional description
}

// CV upload response interface
export interface CVUploadResponse {
  id: number;
  fileUrl: string;
  storageKey: string;
  originFilename: string;
  fileType: string;
  status: CVStatus;
  createdAt: string;
  updatedAt: string;
}

// CV list response interface
export interface CVListResponse {
  content: CVEntity[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

// CV search parameters
export interface CVSearchParams {
  page?: number;
  size?: number;
  status?: CVStatus;
  fileType?: string;
}

// CV update request interface
export interface CVUpdateRequest {
  id: number;
  label?: string;
  description?: string;
}

// CV statistics interface
export interface CVStatistics {
  total: number;
  active: number;
  inactive: number;
  deleted: number;
}

// File upload progress interface
export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// Supported file types
export const SUPPORTED_CV_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// File type display names
export const FILE_TYPE_DISPLAY_NAMES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'Word Document',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word Document'
};

// Maximum file size (5MB)
export const MAX_CV_FILE_SIZE = 5 * 1024 * 1024;
