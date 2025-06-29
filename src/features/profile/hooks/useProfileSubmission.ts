/**
 * Hook for handling complete profile submission flow
 * Manages the process of submitting a completed profile to the API
 * If submission fails, automatically cleans up the profile state
 */

import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { submitCompleteProfile, createProfile } from '../ProfileSlice';
import { calculateProfileCompletion } from '../utils/profileCompletion';
import { useProfileApiTransform } from '../utils/profileApiUtils';
import toast from 'react-hot-toast';
import type { Profile } from '../types/profile.types';

interface UseProfileSubmissionReturn {
  isSubmitting: boolean;
  submitProfile: (profile: Profile) => Promise<void>;
  canSubmit: (profile: Profile) => boolean;
  submissionError: string | null;
}

export const useProfileSubmission = (): UseProfileSubmissionReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { transformToApi } = useProfileApiTransform();
  const { error } = useAppSelector(state => state.profile);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  /**
   * Check if profile can be submitted (minimum completion requirements)
   */
  const canSubmit = useCallback((profile: Profile): boolean => {
    const completionPercentage = calculateProfileCompletion(profile);
    return completionPercentage >= 70; // Require at least 70% completion
  }, []);

  /**
   * Submit completed profile to API
   */
  const submitProfile = useCallback(async (profile: Profile): Promise<void> => {
    if (!profile || !profile.id) {
      setSubmissionError('Profile data is missing');
      return;
    }

    if (!canSubmit(profile)) {
      setSubmissionError('Profile is not complete enough to submit. Please fill in more information.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // Show loading toast
      toast.loading('Creating your profile...', { id: 'profile-submit' });

      // Transform profile to API format for preview
      const apiData = transformToApi(profile);
      console.log('Submitting profile data:', apiData);

      // Step 1: Create profile via API (this is the FIRST API call)
      const profileFormData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio,
        website: profile.website,
        location: profile.location,
        socialLinks: profile.socialLinks,
        ...(profile.role === 'job_seeker' && {
          title: profile.jobSeekerData?.title,
          summary: profile.jobSeekerData?.summary,
          skills: profile.jobSeekerData?.skills,
          experienceLevel: profile.jobSeekerData?.experienceLevel,
          yearsOfExperience: profile.jobSeekerData?.yearsOfExperience,
          preferredRoles: profile.jobSeekerData?.preferredRoles,
          salaryExpectation: profile.jobSeekerData?.salaryExpectation,
          employmentTypes: profile.jobSeekerData?.employmentTypes,
          workLocationPreference: profile.jobSeekerData?.workLocationPreference,
          availabilityDate: profile.jobSeekerData?.availabilityDate,
          isOpenToWork: profile.jobSeekerData?.isOpenToWork
        }),
        ...(profile.role === 'employer' && {
          companyName: profile.employerData?.companyName,
          companySize: profile.employerData?.companySize,
          industry: profile.employerData?.industry,
          companyDescription: profile.employerData?.companyDescription,
          companyWebsite: profile.employerData?.companyWebsite,
          foundedYear: profile.employerData?.foundedYear,
          headquarters: profile.employerData?.headquarters,
          benefits: profile.employerData?.benefits,
          culture: profile.employerData?.culture,
          techStack: profile.employerData?.techStack
        })
      };

      const createResult = await dispatch(createProfile({ 
        role: profile.role, 
        profileData: profileFormData as any 
      }));

      if (createProfile.fulfilled.match(createResult)) {
        const createdProfile = createResult.payload;
        
        toast.loading('Finalizing your profile...', { id: 'profile-submit' });
        
        // Step 2: Submit the created profile (this is the SECOND API call)
        const submitResult = await dispatch(submitCompleteProfile(createdProfile.id));

        if (submitCompleteProfile.fulfilled.match(submitResult)) {
          // Success
          toast.success('Profile submitted successfully!', { id: 'profile-submit' });
          
          // Navigate to success page with API output
          navigate('/profile/success', { 
            state: { 
              profileType: profile.role,
              submittedData: apiData 
            }
          });
        } else {
          // Submit failed
          const errorMessage = submitResult.payload as string || 'Profile submission failed';
          setSubmissionError(errorMessage);
          toast.error(errorMessage, { id: 'profile-submit' });
          
          // Navigate back to role selection since profile state will be cleared
          navigate('/choose-role', { 
            state: { 
              error: 'Profile submission failed. Please try again.',
              previousData: apiData
            }
          });
        }
      } else {
        // Create failed
        const errorMessage = createResult.payload as string || 'Profile creation failed';
        setSubmissionError(errorMessage);
        toast.error(errorMessage, { id: 'profile-submit' });
        
        navigate('/choose-role', { 
          state: { 
            error: errorMessage
          }
        });
      }
    } catch (error: any) {
      console.error('Profile submission error:', error);
      const errorMessage = error.message || 'An unexpected error occurred';
      setSubmissionError(errorMessage);
      toast.error(errorMessage, { id: 'profile-submit' });
      
      // Navigate back to role selection
      navigate('/choose-role', { 
        state: { 
          error: errorMessage
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [dispatch, navigate, transformToApi, canSubmit]);

  return {
    isSubmitting,
    submitProfile,
    canSubmit,
    submissionError: submissionError || error
  };
};
