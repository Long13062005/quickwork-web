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
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null as T;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Get current user's profile
  async getMyProfile(): Promise<ProfileData | null> {
    return this.makeRequest<ProfileData>('/profiles/me');
  }

  // Get profile by user ID
  async getProfile(userId: string): Promise<ProfileData | null> {
    return this.makeRequest<ProfileData>(`/profiles/${userId}`);
  }

  // Legacy method for backward compatibility
  async getProfiles(): Promise<ProfilesResponse> {
    return this.makeRequest<ProfilesResponse>('/profiles');
  }

  // Create new profile
  async createProfile(request: CreateProfileRequest): Promise<ProfileData> {
    return this.makeRequest<ProfileData>('/profiles', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // Update existing profile
  async updateProfile(request: UpdateProfileRequest): Promise<ProfileData> {
    return this.makeRequest<ProfileData>('/profiles/me', {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  // Legacy create method for backward compatibility
  async createLegacyProfile(request: LegacyCreateProfileRequest): Promise<ProfileResponse> {
    // Convert legacy request to new format
    const { role, formData } = request;
    const profileType = role === 'jobseeker' ? 'JOB_SEEKER' : 'EMPLOYER';
    
    const newRequest: CreateProfileRequest = {
      profileType,
      fullName: `${formData.firstName} ${formData.lastName}`,
      title: formData.professionalTitle || formData.companyName,
      phone: formData.phone,
      address: formData.location || formData.companyLocation,
      summary: formData.bio || formData.companyDescription,
      skills: formData.skills,
      experiences: formData.experience ? [formData.experience] : undefined,
      companyName: formData.companyName,
      companyWebsite: formData.companyWebsite,
    };

    try {
      const profile = await this.createProfile(newRequest);
      return {
        success: true,
        message: 'Profile created successfully',
        profile
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create profile',
      };
    }
  }

  // Legacy update method for backward compatibility
  async updateLegacyProfile(request: LegacyUpdateProfileRequest): Promise<ProfileResponse> {
    console.log('ProfileAPI: Updating legacy profile using unified backend endpoint...');
    
    const { formData } = request; // profileId not needed for unified backend endpoint
    
    console.log('ProfileAPI: Converting legacy update request:', {
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

    try {
      const profile = await this.updateProfile(newRequest);
      return {
        success: true,
        message: 'Profile updated successfully',
        profile
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile',
      };
    }
  }

  async deleteProfile(profileId: string): Promise<{ success: boolean; message: string }> {
    return this.makeRequest<{ success: boolean; message: string }>(`/profiles/${profileId}`, {
      method: 'DELETE',
    });
  }

  async uploadProfilePicture(profileId: string, file: File): Promise<ProfileResponse> {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return this.makeRequest<ProfileResponse>(`/profiles/${profileId}/upload-picture`, {
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
    const endpoint = queryString ? `/profiles/search?${queryString}` : '/profiles/search';
    
    return this.makeRequest<ProfilesResponse>(endpoint);
  }
}

export const profileApi = new ProfileApi();
