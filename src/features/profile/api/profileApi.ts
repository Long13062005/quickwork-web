/**
 * Profile API service
 * Handles all profile-related API communications using secure HTTPS-only cookies
 * 
 * Main Endpoints:
 * - GET  /api/profile/me           - Get current user's profile
 * - GET  /api/profile/{userid}     - Get profile by user ID
 * - POST /api/profile              - Create new profile
 * - PATCH /api/profile/{profileId} - Update profile
 * - DELETE /api/profile/{profileId} - Delete profile
 * 
 * Security Features:
 * - Uses credentials: 'include' for secure cookie authentication
 * - No localStorage token usage - relies on secure HTTP-only cookies
 * - All requests include withCredentials for automatic cookie handling
 */

import type {
  ProfileResponse,
  ProfileListResponse,
  ProfileUpdatePayload,
  ProfileSearchParams,
  JobSeekerProfileFormData,
  EmployerProfileFormData,
  UserRole,
} from '../types/profile.types';

/**
 * Base API configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1010/api';
// const API_VERSION = 'v1';
const PROFILE_ENDPOINT = `${API_BASE_URL}/profile`;

/**
 * API utility functions
 */
class ProfileApiService {
  /**
   * Get authorization headers for secure cookie-based auth
   */
  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      // Credentials will be sent automatically via secure cookies
    };
  }

  /**
   * Get fetch options with credentials for secure cookie authentication
   */
  private getFetchOptions(options: RequestInit = {}): RequestInit {
    return {
      ...options,
      credentials: 'include', // Include secure cookies in requests
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    };
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Get current user's profile
   */
  async getCurrentProfile(): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/me`, this.getFetchOptions({
      method: 'GET',
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Get profile by user ID
   * Endpoint: GET /api/profile/{userid}
   */
  async getProfileById(userId: string): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${userId}`, this.getFetchOptions({
      method: 'GET',
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Create a new profile
   * Endpoint: POST /api/profile
   */
  async createProfile(
    role: UserRole,
    profileData: JobSeekerProfileFormData | EmployerProfileFormData
  ): Promise<ProfileResponse> {
    const response = await fetch(PROFILE_ENDPOINT, this.getFetchOptions({
      method: 'POST',
      body: JSON.stringify({ role, ...profileData }),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Submit completed profile to API for final processing
   * This is called after all profile data is complete
   * Endpoint: POST /api/profile/submit
   */
  async submitCompleteProfile(profileId: string): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/submit`, this.getFetchOptions({
      method: 'POST',
      body: JSON.stringify({ action: 'submit_complete' }),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Update profile
   */
  async updateProfile(
    profileId: string,
    updates: ProfileUpdatePayload
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}`, this.getFetchOptions({
      method: 'PATCH',
      body: JSON.stringify(updates),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Delete profile
   */
  async deleteProfile(profileId: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}`, this.getFetchOptions({
      method: 'DELETE',
    }));
    return this.handleResponse<{ success: boolean; message: string }>(response);
  }

  /**
   * Search profiles
   */
  async searchProfiles(params: ProfileSearchParams): Promise<ProfileListResponse> {
    const searchParams = new URLSearchParams();
    
    // Add search parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v.toString()));
        } else if (typeof value === 'object') {
          searchParams.append(key, JSON.stringify(value));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await fetch(`${PROFILE_ENDPOINT}/search?${searchParams}`, this.getFetchOptions({
      method: 'GET',
    }));
    return this.handleResponse<ProfileListResponse>(response);
  }

  /**
   * Upload profile avatar
   */
  async uploadAvatar(
    profileId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; message: string }> {
    return this.uploadFile(profileId, file, 'avatar', onProgress);
  }

  /**
   * Upload resume (for job seekers)
   */
  async uploadResume(
    profileId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; message: string }> {
    return this.uploadFile(profileId, file, 'resume', onProgress);
  }

  /**
   * Upload company logo (for employers)
   */
  async uploadCompanyLogo(
    profileId: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; message: string }> {
    return this.uploadFile(profileId, file, 'company_logo', onProgress);
  }

  /**
   * Generic file upload method with secure cookie authentication
   */
  private async uploadFile(
    profileId: string,
    file: File,
    type: 'avatar' | 'resume' | 'company_logo' | 'project_image',
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; message: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Include credentials for secure cookie authentication
      xhr.withCredentials = true;

      // Handle upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            reject(new Error(errorResponse.message || `Upload failed: ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed: Network error'));
      });

      xhr.open('POST', `${PROFILE_ENDPOINT}/${profileId}/upload`);
      // No need to set Authorization header - cookies will be sent automatically
      xhr.send(formData);
    });
  }

  /**
   * Add work experience
   */
  async addWorkExperience(
    profileId: string,
    experience: Omit<import('../types/profile.types').WorkExperience, 'id'>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/experience`, this.getFetchOptions({
      method: 'POST',
      body: JSON.stringify(experience),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Update work experience
   */
  async updateWorkExperience(
    profileId: string,
    experienceId: string,
    updates: Partial<import('../types/profile.types').WorkExperience>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/experience/${experienceId}`, this.getFetchOptions({
      method: 'PATCH',
      body: JSON.stringify(updates),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Delete work experience
   */
  async deleteWorkExperience(
    profileId: string,
    experienceId: string
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/experience/${experienceId}`, this.getFetchOptions({
      method: 'DELETE',
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Add education
   */
  async addEducation(
    profileId: string,
    education: Omit<import('../types/profile.types').Education, 'id'>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/education`, this.getFetchOptions({
      method: 'POST',
      body: JSON.stringify(education),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Update education
   */
  async updateEducation(
    profileId: string,
    educationId: string,
    updates: Partial<import('../types/profile.types').Education>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/education/${educationId}`, this.getFetchOptions({
      method: 'PATCH',
      body: JSON.stringify(updates),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Delete education
   */
  async deleteEducation(
    profileId: string,
    educationId: string
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/education/${educationId}`, this.getFetchOptions({
      method: 'DELETE',
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Add project
   */
  async addProject(
    profileId: string,
    project: Omit<import('../types/profile.types').Project, 'id'>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/projects`, this.getFetchOptions({
      method: 'POST',
      body: JSON.stringify(project),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Update project
   */
  async updateProject(
    profileId: string,
    projectId: string,
    updates: Partial<import('../types/profile.types').Project>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/projects/${projectId}`, this.getFetchOptions({
      method: 'PATCH',
      body: JSON.stringify(updates),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Delete project
   */
  async deleteProject(
    profileId: string,
    projectId: string
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/projects/${projectId}`, this.getFetchOptions({
      method: 'DELETE',
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Add certification
   */
  async addCertification(
    profileId: string,
    certification: Omit<import('../types/profile.types').Certification, 'id'>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/certifications`, this.getFetchOptions({
      method: 'POST',
      body: JSON.stringify(certification),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Update certification
   */
  async updateCertification(
    profileId: string,
    certificationId: string,
    updates: Partial<import('../types/profile.types').Certification>
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/certifications/${certificationId}`, this.getFetchOptions({
      method: 'PATCH',
      body: JSON.stringify(updates),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Delete certification
   */
  async deleteCertification(
    profileId: string,
    certificationId: string
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/certifications/${certificationId}`, this.getFetchOptions({
      method: 'DELETE',
    }));
    return this.handleResponse<ProfileResponse>(response);
  }

  /**
   * Get profile completion status
   */
  async getProfileCompletion(profileId: string): Promise<{
    completion: import('../types/profile.types').ProfileCompletion;
  }> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/completion`, this.getFetchOptions({
      method: 'GET',
    }));
    return this.handleResponse<{ completion: import('../types/profile.types').ProfileCompletion }>(response);
  }

  /**
   * Toggle profile visibility/status
   */
  async updateProfileStatus(
    profileId: string,
    status: import('../types/profile.types').ProfileStatus
  ): Promise<ProfileResponse> {
    const response = await fetch(`${PROFILE_ENDPOINT}/${profileId}/status`, this.getFetchOptions({
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }));
    return this.handleResponse<ProfileResponse>(response);
  }
}

// Export singleton instance
export const profileApiService = new ProfileApiService();
export default profileApiService;
