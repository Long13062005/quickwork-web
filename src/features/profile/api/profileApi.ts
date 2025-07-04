import type {
  CreateProfileRequest,
  UpdateProfileRequest,
  ProfileResponse,
  ProfilesResponse,
  ProfileData,
  LegacyCreateProfileRequest,
  LegacyUpdateProfileRequest
} from '../types/profile.types';

// Base API URL - adjust based on your backend setup
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:1010/api';

/**
 * ProfileApi class for handling profile-related API operations
 * 
 * Backend Endpoint Design:
 * - Uses a unified POST /profile endpoint for both create and update operations
 * - Backend determines create vs update based on profile existence
 * - Returns 403 (Forbidden) for SecurityException (authentication issues)
 * - Uses HTTPOnly cookie authentication for all requests
 * 
 * Expected ProfileData structure from backend:
 * {
 *   "userId": 1,
 *   "profileType": "JOB_SEEKER",
 *   "fullName": "Alice Johnson",
 *   "avatarUrl": "https://example.com/avatar.jpg",
 *   "phone": "+1234567890",
 *   "title": "Software Developer",
 *   "address": "123 Main St",
 *   "summary": "Experienced software developer seeking new opportunities.",
 *   "skills": ["Java", "Spring Boot", "SQL"],
 *   "experiences": ["3 years at TechCorp", "2 years at DevSolutions"],
 *   "companyName": null,
 *   "companyWebsite": null
 * }
 */
class ProfileApi {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // CRITICAL: Include HTTPOnly cookies for authentication
      ...options,
    };

    console.log('ProfileAPI: Making request to:', url);
    console.log('ProfileAPI: Using HTTPOnly cookie authentication');
    console.log('ProfileAPI: Request config:', {
      method: config.method || 'GET',
      credentials: config.credentials,
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      
      console.log('ProfileAPI: Response status:', response.status);
      console.log('ProfileAPI: Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('ProfileAPI: Profile not found (404) - returning null');
          return null as T;
        }
        
        if (response.status === 403) {
          console.error('ProfileAPI: 403 Forbidden - SecurityException from backend');
          console.error('ProfileAPI: HTTPOnly cookie authentication failed');
          console.error('ProfileAPI: This indicates a SecurityException was thrown by the backend:');
          console.error('- User session has expired or is invalid');
          console.error('- User is not logged in or lacks proper authentication');
          console.error('- Backend authentication service rejected the request');
          console.error('- HTTPOnly cookie missing or corrupted');
          
          // Try to get more details from the response
          try {
            const errorBody = await response.text();
            console.error('ProfileAPI: SecurityException response body:', errorBody);
          } catch (e) {
            console.error('ProfileAPI: Could not read SecurityException response body');
          }
        }
        
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        console.error('ProfileAPI: Request failed:', errorMessage);
        throw new Error(errorMessage);
      }
      
      console.log('ProfileAPI: Request successful');
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get current user's profile (matches your backend endpoint)
  async getMyProfile(): Promise<ProfileData | null> {
    console.log('ProfileAPI: Getting my profile...');
    
    try {
      const profile = await this.makeRequest<ProfileData>('/profile/me');
      console.log('ProfileAPI: Successfully retrieved profile:', profile ? 'found' : 'not found');
      return profile;
    } catch (error) {
      console.error('ProfileAPI: Failed to get my profile:', error);
      
      // If 403, likely authentication issue - but let the calling code handle it
      if (error instanceof Error && error.message.includes('403')) {
        console.error('ProfileAPI: Authentication failed when getting profile');
        return null;
      }
      
      throw error;
    }
  }

  // Get profile by user ID (matches your backend endpoint)
  async getProfile(userId: string): Promise<ProfileData | null> {
    return this.makeRequest<ProfileData>(`/profile/${userId}`);
  }

  async getProfiles(): Promise<ProfilesResponse> {
    return this.makeRequest<ProfilesResponse>('/profile');
  }

  async createProfile(request: CreateProfileRequest): Promise<ProfileData> {
    console.log('ProfileAPI: Creating profile using unified endpoint...');
    return this.makeRequest<ProfileData>('/profile', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateProfile(request: UpdateProfileRequest): Promise<ProfileData> {
    console.log('ProfileAPI: Updating profile using unified endpoint...');
    // Backend uses the same POST endpoint for both create and update
    return this.makeRequest<ProfileData>('/profile', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Legacy create method for backward compatibility
  async createLegacyProfile(request: LegacyCreateProfileRequest): Promise<ProfileResponse> {
    console.log('ProfileAPI: Creating legacy profile using unified backend endpoint...');
    
    // Convert legacy request to new format
    const { role, formData } = request;
    let profileType: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
    
    if (role === 'jobseeker') {
      profileType = 'JOB_SEEKER';
    } else if (role === 'employer') {
      profileType = 'EMPLOYER';
    } else if (role === 'admin') {
      profileType = 'ADMIN';
    } else {
      // Default fallback
      profileType = 'JOB_SEEKER';
    }
    
    console.log('ProfileAPI: Converting legacy request:', {
      role,
      profileType,
      formDataKeys: Object.keys(formData)
    });
    
    const newRequest: CreateProfileRequest = {
      profileType,
      fullName: `${formData.firstName} ${formData.lastName}`,
      title: formData.professionalTitle || formData.companyName || null,
      phone: formData.phone || null,
      address: formData.location || formData.companyLocation || null,
      summary: formData.bio || formData.companyDescription || null,
      avatarUrl: formData.avatarUrl || formData.profilePicture || null,
      skills: formData.skills || null,
      experiences: formData.experience ? [formData.experience] : null,
      companyName: formData.companyName || null,
      companyWebsite: formData.companyWebsite || null,
    };

    console.log('ProfileAPI: Sending create request to unified backend endpoint:', newRequest);

    try {
      const profile = await this.createProfile(newRequest);
      console.log('ProfileAPI: Profile created successfully via unified endpoint:', profile);
      console.log('ProfileAPI: Profile creation complete - ready for dashboard redirect');
      return {
        success: true,
        message: 'Profile created successfully',
        profile
      };
    } catch (error) {
      console.error('ProfileAPI: Failed to create profile via unified endpoint:', error);
      
      // Enhanced error handling for 403 errors (SecurityException from backend)
      if (error instanceof Error && error.message.includes('403')) {
        return {
          success: false,
          message: 'Authentication failed. Please login again and try creating your profile.'
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create profile',
      };
    }
  }

  // Legacy update method for backward compatibility
  async updateLegacyProfile(request: LegacyUpdateProfileRequest): Promise<ProfileResponse> {
    console.log('ProfileAPI: Updating legacy profile using unified backend endpoint...');
    
    const { profileId, formData } = request;
    
    console.log('ProfileAPI: Converting legacy update request:', {
      profileId,
      formDataKeys: Object.keys(formData)
    });
    
    const newRequest: UpdateProfileRequest = {
      fullName: formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : null,
      title: formData.professionalTitle || formData.companyName || null,
      phone: formData.phone || null,
      address: formData.location || formData.companyLocation || null,
      summary: formData.bio || formData.companyDescription || null,
      avatarUrl: formData.avatarUrl || formData.profilePicture || null,
      skills: formData.skills || null,
      experiences: formData.experience ? [formData.experience] : null,
      companyName: formData.companyName || null,
      companyWebsite: formData.companyWebsite || null,
    };

    console.log('ProfileAPI: Sending update request to unified backend endpoint:', newRequest);

    try {
      const profile = await this.updateProfile(newRequest);
      console.log('ProfileAPI: Profile updated successfully via unified endpoint:', profile);
      return {
        success: true,
        message: 'Profile updated successfully',
        profile
      };
    } catch (error) {
      console.error('ProfileAPI: Failed to update profile via unified endpoint:', error);
      
      // Enhanced error handling for 403 errors (SecurityException from backend)
      if (error instanceof Error && error.message.includes('403')) {
        return {
          success: false,
          message: 'Authentication failed. Please login again and try updating your profile.'
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }

  async deleteProfile(profileId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(`/profile/${profileId}`, {
      method: 'DELETE',
    });
  }

  async uploadProfilePicture(profileId: string, file: File): Promise<ProfileResponse> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.makeRequest<ProfileResponse>(`/profile/${profileId}/upload-picture`, {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  async searchProfiles(params: {
    query?: string;
    role?: string;
    location?: string;
    skills?: string[];
    page?: number;
    limit?: number;
  }): Promise<ProfilesResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/profile/search?${queryString}` : '/profile/search';
    
    return this.makeRequest<ProfilesResponse>(endpoint);
  }
}

export const profileApi = new ProfileApi();
