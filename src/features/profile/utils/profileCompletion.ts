/**
 * Profile completion utilities
 * Calculate profile completion percentage based on filled fields
 */

import type { Profile, JobSeekerProfile, EmployerProfile } from '../types/profile.types';

/**
 * Calculate profile completion percentage
 */
export const calculateProfileCompletion = (profile: Profile): number => {
  if (!profile) return 0;

  const isJobSeeker = profile.role === 'job_seeker';
  const isEmployer = profile.role === 'employer';

  // Base fields (common to all profiles)
  const baseFields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.bio,
    profile.location?.city,
    profile.location?.state
  ];

  let totalFields = baseFields.length;
  let completedFields = baseFields.filter(field => field && field.trim().length > 0).length;

  if (isJobSeeker) {
    const jobSeekerProfile = profile as JobSeekerProfile;
    const jobSeekerFields = [
      jobSeekerProfile.jobSeekerData?.title,
      jobSeekerProfile.jobSeekerData?.summary,
      jobSeekerProfile.jobSeekerData?.skills?.length > 0 ? 'skills' : null,
      jobSeekerProfile.jobSeekerData?.experience?.length > 0 ? 'experience' : null
    ];
    
    totalFields += jobSeekerFields.length;
    completedFields += jobSeekerFields.filter(field => field && (typeof field === 'string' ? field.trim().length > 0 : true)).length;
  }

  if (isEmployer) {
    const employerProfile = profile as EmployerProfile;
    const employerFields = [
      employerProfile.employerData?.companyName,
      employerProfile.employerData?.companyDescription,
      employerProfile.employerData?.industry,
      employerProfile.employerData?.companySize
    ];
    
    totalFields += employerFields.length;
    completedFields += employerFields.filter(field => field && field.trim().length > 0).length;
  }

  return Math.round((completedFields / totalFields) * 100);
};

/**
 * Get missing profile fields for completion
 */
export const getMissingProfileFields = (profile: Profile): string[] => {
  if (!profile) return ['Complete profile setup'];

  const missing: string[] = [];
  const isJobSeeker = profile.role === 'job_seeker';
  const isEmployer = profile.role === 'employer';

  // Check base fields
  if (!profile.firstName) missing.push('First name');
  if (!profile.lastName) missing.push('Last name');
  if (!profile.phone) missing.push('Phone number');
  if (!profile.bio) missing.push('Bio/Summary');
  if (!profile.location?.city) missing.push('Location');

  if (isJobSeeker) {
    const jobSeekerProfile = profile as JobSeekerProfile;
    if (!jobSeekerProfile.jobSeekerData?.title) missing.push('Professional title');
    if (!jobSeekerProfile.jobSeekerData?.skills?.length) missing.push('Skills');
    if (!jobSeekerProfile.jobSeekerData?.experience?.length) missing.push('Work experience');
  }

  if (isEmployer) {
    const employerProfile = profile as EmployerProfile;
    if (!employerProfile.employerData?.companyName) missing.push('Company name');
    if (!employerProfile.employerData?.industry) missing.push('Industry');
    if (!employerProfile.employerData?.companySize) missing.push('Company size');
  }

  return missing;
};
