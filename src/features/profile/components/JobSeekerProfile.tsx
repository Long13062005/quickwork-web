/**
 * JobSeekerProfile component
 * Main profile management interface for job seekers
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileLayout } from './ProfileLayout';
import { ProfileForm } from './ProfileForm.tsx';
import { ProfilePreview } from './ProfilePreview.tsx';
import { useProfile } from '../hooks/useProfile';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import type { ProfileTab, JobSeekerProfile } from '../types/profile.types';

/**
 * JobSeekerProfile component
 */
const JobSeekerProfile: React.FC = () => {
  const { profile } = useProfile();
  const { saveProfile, publishProfile, isSaving } = useProfileUpdate();
  
  // Local state
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  /**
   * Handle tab changes
   */
  const handleTabChange = (tab: ProfileTab) => {
    setActiveTab(tab);
  };

  /**
   * Handle save actions
   */
  const handleSave = async () => {
    await saveProfile('save_draft');
  };

  const handlePublish = async () => {
    await publishProfile();
  };

  /**
   * Render tab content
   */
  const renderTabContent = () => {
    if (!profile) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Loading profile...
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'basic-info':
        return <ProfileForm profile={profile} section="basic" />;
      case 'professional':
        return <ProfileForm profile={profile} section="skills" />;
      case 'experience':
        return <ProfileForm profile={profile} section="experience" />;
      case 'education':
        return <ProfileForm profile={profile} section="education" />;
      case 'projects':
        return <ProfileForm profile={profile} section="projects" />;
      case 'certifications':
        return <ProfileForm profile={profile} section="certifications" />;
      case 'preferences':
        return <ProfileForm profile={profile} section="preferences" />;
      case 'preview':
        return <ProfilePreview profile={profile} />;
      default:
        return <div>Tab content not implemented</div>;
    }
  };

  return (
    <ProfileLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white capitalize">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-1">
              {getTabDescription(activeTab)}
            </p>
          </div>

          {/* Action Buttons */}
          {activeTab !== 'preview' && activeTab !== 'overview' && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={handlePublish}
                disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSaving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </ProfileLayout>
  );
};

/**
 * Overview tab component
 */
function OverviewTab(): React.JSX.Element {
  const { profile } = useProfile();

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-4">
          Welcome to Your Profile, {profile?.firstName}! 👋
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Complete your profile to increase your visibility to employers and unlock more job opportunities.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {profile?.role === 'job_seeker' ? (profile as JobSeekerProfile).jobSeekerData?.skills?.length || 0 : 0}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Skills</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {profile?.role === 'job_seeker' ? (profile as JobSeekerProfile).jobSeekerData?.experience?.length || 0 : 0}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">Experience</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {profile?.role === 'job_seeker' ? (profile as JobSeekerProfile).jobSeekerData?.projects?.length || 0 : 0}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Projects</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {profile?.role === 'job_seeker' ? (profile as JobSeekerProfile).jobSeekerData?.certifications?.length || 0 : 0}
            </div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Certifications</div>
          </div>
        </div>
      </div>

      {/* Profile Completion Checklist */}
      <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Profile Completion Checklist
        </h3>
        
        <div className="space-y-3">
          {getCompletionChecklist(profile).map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`
                w-5 h-5 rounded-full flex items-center justify-center
                ${item.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-zinc-600'}
              `}>
                {item.completed && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`
                ${item.completed ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400'}
              `}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Get tab description
 */
function getTabDescription(tab: ProfileTab): string {
  const descriptions: Record<ProfileTab, string> = {
    overview: 'View your profile completion status and key metrics',
    'basic-info': 'Update your personal information and contact details',
    professional: 'Add your skills, experience level, and career objectives',
    experience: 'Showcase your work history and professional achievements',
    education: 'Add your educational background and qualifications',
    projects: 'Highlight your personal and professional projects',
    certifications: 'List your professional certifications and licenses',
    preferences: 'Set your job preferences and availability',
    company: 'Manage your company information and culture',
    preview: 'See how your profile appears to employers',
  };
  
  return descriptions[tab] || '';
}

/**
 * Get profile completion checklist
 */
function getCompletionChecklist(profile: any) {
  return [
    {
      label: 'Add profile photo',
      completed: !!profile?.avatar,
    },
    {
      label: 'Complete basic information',
      completed: !!(profile?.firstName && profile?.lastName && profile?.email && profile?.bio),
    },
    {
      label: 'Add professional title and summary',
      completed: !!(profile?.jobSeekerData?.title && profile?.jobSeekerData?.summary),
    },
    {
      label: 'List at least 5 skills',
      completed: (profile?.jobSeekerData?.skills?.length || 0) >= 5,
    },
    {
      label: 'Add work experience',
      completed: (profile?.jobSeekerData?.experience?.length || 0) > 0,
    },
    {
      label: 'Add education background',
      completed: (profile?.jobSeekerData?.education?.length || 0) > 0,
    },
    {
      label: 'Set job preferences',
      completed: !!(profile?.jobSeekerData?.employmentTypes?.length && profile?.jobSeekerData?.workLocationPreference?.length),
    },
    {
      label: 'Upload resume',
      completed: !!profile?.jobSeekerData?.resume,
    },
  ];
}

export default JobSeekerProfile;
