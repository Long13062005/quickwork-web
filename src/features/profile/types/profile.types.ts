/**
 * Profile feature types
 * Comprehensive type definitions for user profiles
 */

/**
 * User role types
 */
export type UserRole = 'job_seeker' | 'employer';

/**
 * Profile status types
 */
export type ProfileStatus = 'draft' | 'active' | 'inactive' | 'suspended';

/**
 * Experience level types
 */
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive';

/**
 * Employment type preferences
 */
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';

/**
 * Work location preferences
 */
export type WorkLocation = 'remote' | 'on_site' | 'hybrid';

/**
 * Base profile interface
 */
export interface BaseProfile {
  id: string;
  userId: string;
  role: UserRole;
  status: ProfileStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  avatar?: string;
  avatarUrl?: string; // Firebase storage URL for avatar image
  bio?: string;
  website?: string;
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    portfolio?: string;
  };
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
}

/**
 * Job seeker specific profile data
 */
export interface JobSeekerProfile extends BaseProfile {
  role: 'job_seeker';
  jobSeekerData: {
    title: string;
    summary: string;
    skills: string[];
    experienceLevel: ExperienceLevel;
    yearsOfExperience: number;
    preferredRoles: string[];
    salaryExpectation: {
      min: number;
      max: number;
      currency: string;
    };
    employmentTypes: EmploymentType[];
    workLocationPreference: WorkLocation[];
    availabilityDate: string;
    isOpenToWork: boolean;
    resume?: {
      filename: string;
      url: string;
      uploadedAt: string;
    };
    education: Education[];
    experience: WorkExperience[];
    projects: Project[];
    certifications: Certification[];
    languages: Language[];
  };
}

/**
 * Employer specific profile data
 */
export interface EmployerProfile extends BaseProfile {
  role: 'employer';
  employerData: {
    companyName: string;
    companySize: string;
    industry: string;
    companyDescription: string;
    companyLogo?: string;
    companyWebsite?: string;
    foundedYear?: number;
    headquarters: {
      city: string;
      state: string;
      country: string;
    };
    benefits: string[];
    culture: string[];
    techStack: string[];
    isVerified: boolean;
    verificationBadges: string[];
  };
}

/**
 * Union type for all profile types
 */
export type Profile = JobSeekerProfile | EmployerProfile;

/**
 * Education information
 */
export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  isCurrently: boolean;
  grade?: string;
  description?: string;
  location: {
    city: string;
    state: string;
    country: string;
  };
}

/**
 * Work experience information
 */
export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  employmentType: EmploymentType;
  location: {
    city: string;
    state: string;
    country: string;
  };
  workLocation: WorkLocation;
  startDate: string;
  endDate?: string;
  isCurrently: boolean;
  description: string;
  achievements: string[];
  skills: string[];
  companyLogo?: string;
  companyWebsite?: string;
}

/**
 * Project information
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  isOngoing: boolean;
  projectUrl?: string;
  githubUrl?: string;
  images: string[];
  role: string;
  teamSize?: number;
  achievements: string[];
}

/**
 * Certification information
 */
export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  skills: string[];
}

/**
 * Language proficiency
 */
export interface Language {
  id: string;
  language: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'fluent' | 'native';
  isNative: boolean;
}

/**
 * Profile form data interfaces
 */
export interface JobSeekerProfileFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  bio: string;
  website: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    portfolio: string;
  };
  
  // Professional Info
  title: string;
  summary: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  yearsOfExperience: number;
  preferredRoles: string[];
  
  // Preferences
  salaryExpectation: {
    min: number;
    max: number;
    currency: string;
  };
  employmentTypes: EmploymentType[];
  workLocationPreference: WorkLocation[];
  availabilityDate: string;
  isOpenToWork: boolean;
}

export interface EmployerProfileFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: {
    city: string;
    state: string;
    country: string;
    timezone: string;
  };
  bio: string;
  website: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    portfolio: string;
  };
  
  // Company Info
  companyName: string;
  companySize: string;
  industry: string;
  companyDescription: string;
  companyWebsite: string;
  foundedYear: number;
  headquarters: {
    city: string;
    state: string;
    country: string;
  };
  benefits: string[];
  culture: string[];
  techStack: string[];
}

/**
 * Profile API response types
 */
export interface ProfileResponse {
  success: boolean;
  data: Profile;
  message: string;
}

export interface ProfileListResponse {
  success: boolean;
  data: Profile[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message: string;
}

/**
 * Profile update payload
 */
export interface ProfileUpdatePayload {
  [key: string]: any;
}

/**
 * Profile validation errors
 */
export interface ProfileValidationErrors {
  [fieldName: string]: string | string[] | ProfileValidationErrors;
}

/**
 * Profile state for Redux
 */
export interface ProfileState {
  // Current user profile
  currentProfile: Profile | null;
  
  // UI state
  isLoading: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  
  // Error handling
  error: string | null;
  validationErrors: ProfileValidationErrors | null;
  
  // Form state
  isDirty: boolean;
  isValid: boolean;
  
  // Cache
  lastFetchedAt: string | null;
  
  // Other profiles (for browsing/search)
  profiles: Profile[];
  profilesLoading: boolean;
  profilesError: string | null;
}

/**
 * Profile navigation tab types
 */
export type ProfileTab = 
  | 'overview' 
  | 'basic-info' 
  | 'professional' 
  | 'experience' 
  | 'education' 
  | 'projects' 
  | 'certifications' 
  | 'preferences' 
  | 'company' 
  | 'preview';

/**
 * Profile tab configuration
 */
export interface ProfileTabConfig {
  id: ProfileTab;
  label: string;
  icon: string;
  description: string;
  isAvailableFor: UserRole[];
  isRequired: boolean;
}

/**
 * Profile completion status
 */
export interface ProfileCompletion {
  overall: number;
  sections: {
    [key in ProfileTab]?: {
      completed: number;
      total: number;
      percentage: number;
      missingFields: string[];
    };
  };
}

/**
 * File upload types
 */
export interface FileUpload {
  file: File;
  type: 'avatar' | 'resume' | 'company_logo' | 'project_image';
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

/**
 * Profile search/filter types
 */
export interface ProfileSearchFilters {
  role?: UserRole;
  skills?: string[];
  location?: string;
  experienceLevel?: ExperienceLevel[];
  employmentTypes?: EmploymentType[];
  workLocation?: WorkLocation[];
  salaryRange?: {
    min: number;
    max: number;
  };
  industry?: string[];
  companySize?: string[];
  isOpenToWork?: boolean;
  isVerified?: boolean;
}

export interface ProfileSearchParams extends ProfileSearchFilters {
  query?: string;
  page: number;
  limit: number;
  sortBy: 'relevance' | 'updated_at' | 'created_at' | 'name';
  sortOrder: 'asc' | 'desc';
}

/**
 * API-compatible profile output types
 * These types match the expected JSON output format for the API
 */

/**
 * Job Seeker API output format
 */
export interface JobSeekerApiOutput {
  userId: number;
  profileType: "JOB_SEEKER";
  fullName: string;
  phone: string | null;
  address: string | null;
  summary: string | null;
  skills: string[] | null;
  experiences: string[] | null;
  companyName: null;
  companyWebsite: null;
}

/**
 * Employer API output format
 */
export interface EmployerApiOutput {
  userId: number;
  profileType: "EMPLOYER";
  fullName: string;
  phone: string | null;
  address: string | null;
  summary: string | null;
  skills: null;
  experiences: null;
  companyName: string | null;
  companyWebsite: string | null;
}

/**
 * Union type for API output
 */
export type ProfileApiOutput = JobSeekerApiOutput | EmployerApiOutput;

/**
 * Profile transformation utilities
 */
export class ProfileTransformer {
  /**
   * Transform JobSeekerProfile to API output format
   */
  static toJobSeekerApiOutput(profile: JobSeekerProfile): JobSeekerApiOutput {
    const fullAddress = profile.location ? 
      `${profile.location.city}, ${profile.location.state}` : null;
    
    // Transform experience array to simple strings
    const experienceStrings = profile.jobSeekerData.experience?.map(exp => 
      `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`
    ) || null;

    return {
      userId: parseInt(profile.userId),
      profileType: "JOB_SEEKER",
      fullName: `${profile.firstName} ${profile.lastName}`,
      phone: profile.phone || null,
      address: fullAddress,
      summary: profile.jobSeekerData.summary || null,
      skills: profile.jobSeekerData.skills?.length > 0 ? profile.jobSeekerData.skills : null,
      experiences: experienceStrings?.length > 0 ? experienceStrings : null,
      companyName: null,
      companyWebsite: null
    };
  }

  /**
   * Transform EmployerProfile to API output format
   */
  static toEmployerApiOutput(profile: EmployerProfile): EmployerApiOutput {
    const fullAddress = profile.location ? 
      `${profile.location.city}, ${profile.location.state}` : null;

    return {
      userId: parseInt(profile.userId),
      profileType: "EMPLOYER",
      fullName: `${profile.firstName} ${profile.lastName}`,
      phone: profile.phone || null,
      address: fullAddress,
      summary: profile.employerData.companyDescription || null,
      skills: null,
      experiences: null,
      companyName: profile.employerData.companyName || null,
      companyWebsite: profile.employerData.companyWebsite || null
    };
  }

  /**
   * Transform any Profile to API output format
   */
  static toApiOutput(profile: Profile): ProfileApiOutput {
    if (profile.role === 'job_seeker') {
      return this.toJobSeekerApiOutput(profile as JobSeekerProfile);
    } else {
      return this.toEmployerApiOutput(profile as EmployerProfile);
    }
  }

  /**
   * Transform from API input to internal profile format (for creating profiles)
   */
  static fromJobSeekerApiInput(apiData: Partial<JobSeekerApiOutput>): Partial<JobSeekerProfile> {
    const [firstName, ...lastNameParts] = (apiData.fullName || '').split(' ');
    const lastName = lastNameParts.join(' ');
    
    // Parse address
    const addressParts = apiData.address?.split(', ') || [];
    const city = addressParts[0] || '';
    const state = addressParts[1] || '';

    return {
      firstName: firstName || '',
      lastName: lastName || '',
      phone: apiData.phone || undefined,
      location: {
        city,
        state,
        country: 'US', // Default country
        timezone: 'UTC' // Default timezone
      },
      role: 'job_seeker',
      jobSeekerData: {
        summary: apiData.summary || '',
        skills: apiData.skills || [],
        // Note: experiences would need more complex parsing in real implementation
        experience: [], // Would need to parse experience strings
        title: '', // Would need to be provided separately
        experienceLevel: 'mid', // Default value
        yearsOfExperience: 0, // Default value
        preferredRoles: [],
        salaryExpectation: {
          min: 0,
          max: 0,
          currency: 'USD'
        },
        employmentTypes: [],
        workLocationPreference: [],
        availabilityDate: new Date().toISOString(),
        isOpenToWork: true,
        education: [],
        projects: [],
        certifications: [],
        languages: []
      }
    };
  }

  /**
   * Transform from API input to internal employer profile format
   */
  static fromEmployerApiInput(apiData: Partial<EmployerApiOutput>): Partial<EmployerProfile> {
    const [firstName, ...lastNameParts] = (apiData.fullName || '').split(' ');
    const lastName = lastNameParts.join(' ');
    
    // Parse address
    const addressParts = apiData.address?.split(', ') || [];
    const city = addressParts[0] || '';
    const state = addressParts[1] || '';

    return {
      firstName: firstName || '',
      lastName: lastName || '',
      phone: apiData.phone || undefined,
      location: {
        city,
        state,
        country: 'US', // Default country
        timezone: 'UTC' // Default timezone
      },
      role: 'employer',
      employerData: {
        companyName: apiData.companyName || '',
        companyDescription: apiData.summary || '',
        companyWebsite: apiData.companyWebsite || undefined,
        companySize: '', // Would need to be provided separately
        industry: '', // Would need to be provided separately
        headquarters: {
          city,
          state,
          country: 'US'
        },
        benefits: [],
        culture: [],
        techStack: [],
        isVerified: false,
        verificationBadges: []
      }
    };
  }
}
