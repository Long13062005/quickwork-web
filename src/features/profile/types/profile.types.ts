// Profile Types - Aligned with backend ProfileEntity
export type ProfileType = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';

// Frontend-friendly profile interface that matches backend ProfileEntity exactly
export interface ProfileData {
  id?: number; // Optional for create requests
  userId?: number; // Optional - backend doesn't provide this field
  profileType: ProfileType;
  fullName: string;
  avatarUrl?: string | null;
  phone?: string | null;
  title?: string | null;
  address?: string | null;
  summary?: string | null;
  
  // Job seeker specific
  skills?: string[] | null;
  experiences?: string[] | null;
  
  // Employer specific  
  companyName?: string | null;
  companyWebsite?: string | null;
  
  // Timestamps (optional, set by backend)
  createdAt?: string;
  updatedAt?: string;
}

// Legacy types for backward compatibility with existing components
export type UserRole = 'jobseeker' | 'employer' | 'admin';

// Admin type for admin role profiles
export interface AdminProfile extends BaseProfile {
  role: 'admin';
  // Basic Info (mapped from backend)
  phone?: string;
  location?: string; // Maps to address
  title?: string;    // Professional title
  bio?: string;      // Maps to summary
}

export interface BaseProfile {
  id: string;
  userId?: string; // Optional - backend doesn't provide this field
  role: UserRole;
  email: string;
  // Convert backend fields to legacy format for compatibility
  firstName: string; // Derived from fullName
  lastName: string;  // Derived from fullName
  profilePicture?: string; // Maps to avatarUrl
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
}

export interface JobSeekerProfile extends BaseProfile {
  role: 'jobseeker';
  // Basic Info (mapped from backend)
  phone?: string;
  location?: string; // Maps to address
  
  // Professional Info (mapped from backend)
  professionalTitle?: string; // Maps to title
  experience?: string;
  skills?: string[];
  
  // Additional Info
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string; // Maps to summary
  
  // Preferences (legacy fields not in backend)
  expectedSalary?: number;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  availability?: string;
}

export interface EmployerProfile extends BaseProfile {
  role: 'employer';
  // Company Info (mapped from backend)
  companyName: string;
  companyDescription?: string; // Maps to summary
  industry?: string;
  companySize?: string;
  
  // Contact Info
  phone?: string;
  companyLocation?: string; // Maps to address
  
  // Additional Info
  companyWebsite?: string;
  linkedinUrl?: string;
}

export type Profile = JobSeekerProfile | EmployerProfile | AdminProfile;

// Form Types - Updated to match backend structure
export interface ProfileFormData {
  // Backend-aligned fields
  fullName: string;
  title?: string;
  phone?: string;
  address?: string;
  summary?: string;
  avatarUrl?: string;
  skills?: string[];
  experiences?: string[];
  
  // Employer specific
  companyName?: string;
  companyWebsite?: string;
  
  // Legacy fields for frontend compatibility (will be converted)
  firstName?: string;
  lastName?: string;
  location?: string;
  professionalTitle?: string;
  bio?: string;
  profilePicture?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  expectedSalary?: number;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  availability?: string;
  experience?: string;
  
  // Employer legacy fields
  companyDescription?: string;
  industry?: string;
  companySize?: string;
  companyLocation?: string;
}

// API Request/Response Types for backend communication
export interface CreateProfileRequest {
  userId?: number; // Optional, backend can determine from auth context
  profileType: ProfileType;
  fullName: string;
  title?: string | null;
  phone?: string | null;
  address?: string | null;
  summary?: string | null;
  avatarUrl?: string | null;
  skills?: string[] | null;
  experiences?: string[] | null;
  companyName?: string | null;
  companyWebsite?: string | null;
}

export interface UpdateProfileRequest {
  userId?: number; // Optional, backend can determine from auth context
  profileType?: ProfileType;
  fullName?: string | null;
  title?: string | null;
  phone?: string | null;
  address?: string | null;
  summary?: string | null;
  avatarUrl?: string | null;
  skills?: string[] | null;
  experiences?: string[] | null;
  companyName?: string | null;
  companyWebsite?: string | null;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile?: ProfileData;
}

export interface ProfilesResponse {
  success: boolean;
  profiles: ProfileData[];
  total: number;
  page: number;
  limit: number;
}

// Legacy API types for backward compatibility
export interface LegacyCreateProfileRequest {
  role: UserRole;
  formData: ProfileFormData;
}

export interface LegacyUpdateProfileRequest {
  profileId: string;
  formData: Partial<ProfileFormData>;
}
