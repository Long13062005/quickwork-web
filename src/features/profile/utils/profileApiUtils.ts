/**
 * Profile API utilities
 * Helper functions for transforming profiles to/from API format
 */

import type { 
  Profile, 
  ProfileApiOutput,
  JobSeekerApiOutput,
  EmployerApiOutput
} from '../types/profile.types';
import { ProfileTransformer } from '../types/profile.types';

/**
 * Export profile in API-compatible format
 */
export const exportProfileForApi = (profile: Profile): ProfileApiOutput => {
  return ProfileTransformer.toApiOutput(profile);
};

/**
 * Export multiple profiles in API-compatible format
 */
export const exportProfilesForApi = (profiles: Profile[]): ProfileApiOutput[] => {
  return profiles.map(profile => ProfileTransformer.toApiOutput(profile));
};

/**
 * Create sample profiles for testing (matching your expected output)
 */
export const createSampleProfiles = (): ProfileApiOutput[] => {
  const jobSeekerOutput: JobSeekerApiOutput = {
    userId: 1,
    profileType: "JOB_SEEKER",
    fullName: "Alice Johnson",
    phone: "+1234567890",
    address: "123 Main St, Cityville",
    summary: "Experienced software developer seeking new opportunities.",
    skills: ["Java", "Spring Boot", "SQL"],
    experiences: ["3 years at TechCorp", "2 years at DevSolutions"],
    companyName: null,
    companyWebsite: null
  };

  const employerOutput: EmployerApiOutput = {
    userId: 2,
    profileType: "EMPLOYER",
    fullName: "Bob Smith",
    phone: "+1987654321",
    address: "456 Business Rd, Metropolis",
    summary: "HR manager at TechEnterprises, looking for talented professionals.",
    skills: null,
    experiences: null,
    companyName: "TechEnterprises",
    companyWebsite: "https://techenterprises.com"
  };

  return [jobSeekerOutput, employerOutput];
};

/**
 * Validate API output format
 */
export const validateJobSeekerApiOutput = (data: any): data is JobSeekerApiOutput => {
  return (
    typeof data === 'object' &&
    typeof data.userId === 'number' &&
    data.profileType === 'JOB_SEEKER' &&
    typeof data.fullName === 'string' &&
    (data.phone === null || typeof data.phone === 'string') &&
    (data.address === null || typeof data.address === 'string') &&
    (data.summary === null || typeof data.summary === 'string') &&
    (data.skills === null || Array.isArray(data.skills)) &&
    (data.experiences === null || Array.isArray(data.experiences)) &&
    data.companyName === null &&
    data.companyWebsite === null
  );
};

export const validateEmployerApiOutput = (data: any): data is EmployerApiOutput => {
  return (
    typeof data === 'object' &&
    typeof data.userId === 'number' &&
    data.profileType === 'EMPLOYER' &&
    typeof data.fullName === 'string' &&
    (data.phone === null || typeof data.phone === 'string') &&
    (data.address === null || typeof data.address === 'string') &&
    (data.summary === null || typeof data.summary === 'string') &&
    data.skills === null &&
    data.experiences === null &&
    (data.companyName === null || typeof data.companyName === 'string') &&
    (data.companyWebsite === null || typeof data.companyWebsite === 'string')
  );
};

/**
 * Format profile data for JSON output
 */
export const formatProfileAsJson = (profile: Profile, pretty: boolean = true): string => {
  const apiOutput = exportProfileForApi(profile);
  return JSON.stringify(apiOutput, null, pretty ? 2 : 0);
};

/**
 * Bulk format profiles for JSON output
 */
export const formatProfilesAsJson = (profiles: Profile[], pretty: boolean = true): string => {
  const apiOutputs = exportProfilesForApi(profiles);
  return JSON.stringify(apiOutputs, null, pretty ? 2 : 0);
};

/**
 * Example usage and testing function
 */
export const demonstrateApiOutput = (): void => {
  console.log('=== Sample Profile API Outputs ===\n');
  
  const samples = createSampleProfiles();
  
  console.log('Job Seeker Profile:');
  console.log(JSON.stringify(samples[0], null, 2));
  
  console.log('\nEmployer Profile:');
  console.log(JSON.stringify(samples[1], null, 2));
  
  console.log('\n=== Validation Results ===');
  console.log('Job Seeker valid:', validateJobSeekerApiOutput(samples[0]));
  console.log('Employer valid:', validateEmployerApiOutput(samples[1]));
};

/**
 * Hook for using profile API transformation in React components
 */
export const useProfileApiTransform = () => {
  const transformToApi = (profile: Profile): ProfileApiOutput => {
    return exportProfileForApi(profile);
  };

  const transformMultipleToApi = (profiles: Profile[]): ProfileApiOutput[] => {
    return exportProfilesForApi(profiles);
  };

  const formatAsJson = (profile: Profile, pretty: boolean = true): string => {
    return formatProfileAsJson(profile, pretty);
  };

  return {
    transformToApi,
    transformMultipleToApi,
    formatAsJson,
    createSamples: createSampleProfiles,
    validateJobSeeker: validateJobSeekerApiOutput,
    validateEmployer: validateEmployerApiOutput
  };
};

// Export sample data for immediate use
export const SAMPLE_API_OUTPUTS = {
  jobSeeker: {
    userId: 1,
    profileType: "JOB_SEEKER" as const,
    fullName: "Alice Johnson",
    phone: "+1234567890",
    address: "123 Main St, Cityville",
    summary: "Experienced software developer seeking new opportunities.",
    skills: ["Java", "Spring Boot", "SQL"],
    experiences: ["3 years at TechCorp", "2 years at DevSolutions"],
    companyName: null,
    companyWebsite: null
  },
  employer: {
    userId: 2,
    profileType: "EMPLOYER" as const,
    fullName: "Bob Smith",
    phone: "+1987654321",
    address: "456 Business Rd, Metropolis",
    summary: "HR manager at TechEnterprises, looking for talented professionals.",
    skills: null,
    experiences: null,
    companyName: "TechEnterprises",
    companyWebsite: "https://techenterprises.com"
  }
};
