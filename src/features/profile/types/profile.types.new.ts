// Profile Types - Aligned with backend ProfileEntity
export type ProfileType = 'JOB_SEEKER' | 'EMPLOYER';

// Backend profile structure matching the Java entity
export interface BackendProfile {
  id: number;
  user: {
    id: number;
    email: string;
  };
  avatarUrl?: string;
  profileType: ProfileType;
  fullName: string;
  title?: string;
  phone?: string;
  address?: string;
  summary?: string;
  
  // Job seeker specific fields
  skills?: string[];
  experiences?: string[];
  
  // Employer specific fields
  companyName?: string;
  companyWebsite?: string;
}

// Frontend-friendly profile interface
export interface ProfileData {
  id: number;
  userId: number;
  profileType: ProfileType;
  email: string;
  fullName: string;
  avatarUrl?: string;
  title?: string;
  phone?: string;
  address?: string;
  summary?: string;
  
  // Job seeker specific
  skills?: string[];
  experiences?: string[];
  
  // Employer specific
  companyName?: string;
  companyWebsite?: string;
}

// Legacy types for backward compatibility with existing components
export type UserRole = 'jobseeker' | 'employer';

export interface BaseProfile {
  id: string;
  userId: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
  isComplete: boolean;
}

export interface JobSeekerProfile extends BaseProfile {
  role: 'jobseeker';
  // Basic Info
  phone?: string;
  location?: string;
  
  // Professional Info
  professionalTitle?: string;
  experience?: string;
  skills?: string[];
  
  // Additional Info
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  
  // Preferences
  expectedSalary?: number;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  availability?: string;
}

export interface EmployerProfile extends BaseProfile {
  role: 'employer';
  // Company Info
  companyName: string;
  companyDescription?: string;
  industry?: string;
  companySize?: string;
  
  // Contact Info
  phone?: string;
  companyLocation?: string;
  
  // Additional Info
  companyWebsite?: string;
  linkedinUrl?: string;
}

export type Profile = JobSeekerProfile | EmployerProfile;

// Form Types
export interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone?: string;
  location?: string;
  professionalTitle?: string;
  experience?: string;
  skills?: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  expectedSalary?: number;
  jobType?: 'full-time' | 'part-time' | 'contract' | 'freelance';
  availability?: string;
  
  // Employer specific
  companyName?: string;
  companyDescription?: string;
  industry?: string;
  companySize?: string;
  companyLocation?: string;
  companyWebsite?: string;
}

// API Request/Response Types for backend communication
export interface CreateProfileRequest {
  profileType: ProfileType;
  fullName: string;
  title?: string;
  phone?: string;
  address?: string;
  summary?: string;
  skills?: string[];
  experiences?: string[];
  companyName?: string;
  companyWebsite?: string;
}

export interface UpdateProfileRequest {
  profileId: number;
  profileType?: ProfileType;
  fullName?: string;
  title?: string;
  phone?: string;
  address?: string;
  summary?: string;
  skills?: string[];
  experiences?: string[];
  companyName?: string;
  companyWebsite?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  profile?: BackendProfile;
}

export interface ProfilesResponse {
  success: boolean;
  profiles: BackendProfile[];
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
