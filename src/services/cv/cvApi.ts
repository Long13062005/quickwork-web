/**
 * CV API Service
 * Handles all CV-related API operations
 */

import { api } from '../api';
import type { 
  CVEntity, 
  CVUploadRequest, 
  CVUploadResponse, 
  CVUpdateRequest,
  FileUploadProgress
} from '../../features/cv/types/cv.types';

const CV_API_BASE = '/cv';

/**
 * CV API Service Class
 */
export class CVApiService {
  /**
   * Upload a new CV file
   */
  async uploadCV(request: CVUploadRequest, onProgress?: (progress: FileUploadProgress) => void): Promise<CVUploadResponse> {
    const formData = new FormData();
    formData.append('file', request.file);
    
    // Add optional label and description fields
    if (request.label) {
      formData.append('label', request.label);
    }
    if (request.description) {
      formData.append('description', request.description);
    }

    try {
      const response = await api.post<CVUploadResponse>(`${CV_API_BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress: FileUploadProgress = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded * 100) / progressEvent.total)
            };
            onProgress(progress);
          }
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('CV upload error:', error);
      throw error;
    }
  }

  /**
   * Get list of CVs for current user
   */
  async getMyCVs(): Promise<CVEntity[]> {
    try {
      const response = await api.get<CVEntity[]>(`${CV_API_BASE}/mine`);
      return response.data;
    } catch (error) {
      console.error('Get my CVs error:', error);
      throw error;
    }
  }

  /**
   * Get CV by ID
   */
  async getCVById(id: number): Promise<CVEntity> {
    try {
      const response = await api.get<CVEntity>(`${CV_API_BASE}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get CV by ID error:', error);
      throw error;
    }
  }

  /**
   * Update CV metadata
   */
  async updateCV(request: CVUpdateRequest): Promise<CVEntity> {
    try {
      const response = await api.put<CVEntity>(`${CV_API_BASE}/${request.id}`, request);
      return response.data;
    } catch (error) {
      console.error('Update CV error:', error);
      throw error;
    }
  }

  /**
   * Delete CV
   */
  async deleteCV(id: number): Promise<void> {
    try {
      await api.delete(`${CV_API_BASE}/${id}`);
    } catch (error) {
      console.error('Delete CV error:', error);
      throw error;
    }
  }

  /**
   * Download CV file
   */
  async downloadCV(id: number): Promise<Blob> {
    try {
      const response = await api.get(`${CV_API_BASE}/${id}/download`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Download CV error:', error);
      throw error;
    }
  }

  /**
   * Preview CV file (for supported formats)
   */
  async previewCV(id: number): Promise<string> {
    try {
      const response = await api.get(`${CV_API_BASE}/${id}/download`, {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Preview CV error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const cvApiService = new CVApiService();
