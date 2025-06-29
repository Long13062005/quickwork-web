/**
 * Enhanced JobSeekerProfile component
 * Modern, accessible profile management interface for job seekers
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedProfileHeader } from './EnhancedProfileHeader';
import { RoleBasedProfileForm } from './RoleBasedProfileForm';
import { useProfile } from '../hooks/useProfile';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { useProfileSubmission } from '../hooks/useProfileSubmission';
import { calculateProfileCompletion, getMissingProfileFields } from '../utils/profileCompletion';
import { useProfileApiTransform } from '../utils/profileApiUtils';
import type { JobSeekerProfile as JobSeekerProfileType, Profile } from '../types/profile.types';

/**
 * Overview Tab component for job seeker profile
 */
interface OverviewTabProps {
  profile: JobSeekerProfileType;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ profile }) => {
  const { jobSeekerData } = profile;
  const missingFields = getMissingProfileFields(profile);
  const completionPercentage = calculateProfileCompletion(profile);

  return (
    <div className="space-y-6">
      {/* Professional Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Professional Summary
        </h3>
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {jobSeekerData.summary || 'Add a professional summary to highlight your expertise and career goals.'}
          </p>
        </div>
      </div>

      {/* Skills Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Skills
        </h3>
        {jobSeekerData.skills && jobSeekerData.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {jobSeekerData.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-full text-sm border border-blue-200 dark:border-blue-800"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Add skills to showcase your expertise to employers.
          </p>
        )}
      </div>

      {/* Recent Experience */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Experience
        </h3>
        {jobSeekerData.experience && jobSeekerData.experience.length > 0 ? (
          <div className="space-y-4">
            {jobSeekerData.experience.slice(0, 3).map((exp, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900 dark:text-white">
                  {exp.position}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {exp.company} • {exp.startDate} - {exp.endDate || 'Present'}
                </p>
                {exp.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                    {exp.description.length > 150 
                      ? `${exp.description.substring(0, 150)}...` 
                      : exp.description
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            Add work experience to demonstrate your career progression.
          </p>
        )}
      </div>

      {/* Profile Completion */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Completion
          </h3>
          <div className="flex items-center space-x-2">
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {completionPercentage}%
            </div>
            <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {missingFields.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>To complete your profile:</strong> {missingFields.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main JobSeekerProfile component
 */
const JobSeekerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'edit'>('overview');
  
  const { profile, isLoading, error } = useProfile();
  const { saveProfile, isSaving } = useProfileUpdate();
  const { transformToApi } = useProfileApiTransform();
  const { isSubmitting, submitProfile, canSubmit } = useProfileSubmission();

  // Type guard to ensure we have a job seeker profile
  const jobSeekerProfile = profile?.role === 'job_seeker' ? profile as JobSeekerProfileType : null;

  const completionPercentage = jobSeekerProfile ? calculateProfileCompletion(jobSeekerProfile) : 0;

  const handleEditToggle = useCallback(() => {
    setIsEditing(!isEditing);
    setActiveSection(isEditing ? 'overview' : 'edit');
  }, [isEditing]);

  const handleSubmitProfile = useCallback(async () => {
    if (!jobSeekerProfile) return;
    await submitProfile(jobSeekerProfile);
  }, [jobSeekerProfile, submitProfile]);

  const handleExportProfile = useCallback(() => {
    if (!jobSeekerProfile) return;
    
    try {
      const apiData = transformToApi(jobSeekerProfile);
      const jsonString = JSON.stringify(apiData, null, 2);
      
      // Create download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${jobSeekerProfile.firstName}_${jobSeekerProfile.lastName}_profile.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting profile:', error);
      alert('Failed to export profile. Please try again.');
    }
  }, [jobSeekerProfile, transformToApi]);

  const handleSaveProfile = useCallback(async (_data: Partial<Profile>) => {
    if (!jobSeekerProfile) return;
    
    try {
      await saveProfile('save_draft');
      setIsEditing(false);
      setActiveSection('overview');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  }, [saveProfile, jobSeekerProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
            Error Loading Profile
          </h2>
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!jobSeekerProfile) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Profile Setup Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please complete your job seeker profile setup to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Enhanced Profile Header */}
        <EnhancedProfileHeader
          profile={jobSeekerProfile}
          completionPercentage={completionPercentage}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onExportProfile={handleExportProfile}
          onSubmitProfile={handleSubmitProfile}
          canSubmit={jobSeekerProfile ? canSubmit(jobSeekerProfile) : false}
          isSubmitting={isSubmitting}
        />

        {/* Main Content */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {activeSection === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <OverviewTab profile={jobSeekerProfile} />
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <RoleBasedProfileForm
                  profile={jobSeekerProfile}
                  onSave={handleSaveProfile}
                  onCancel={handleEditToggle}
                  isLoading={isSaving}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Action Buttons - Mobile */}
        <div className="fixed bottom-4 right-4 lg:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEditToggle}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label={isEditing ? 'View profile' : 'Edit profile'}
          >
            {isEditing ? '👁️' : '✏️'}
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
