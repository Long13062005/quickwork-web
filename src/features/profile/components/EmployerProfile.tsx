/**
 * EmployerProfile component
 * Main profile management interface for employers
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileLayout } from './ProfileLayout';
import { ProfileForm } from './ProfileForm';
import { ProfilePreview } from './ProfilePreview';
import { useProfile } from '../hooks/useProfile';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import type { ProfileTab, EmployerProfile as EmployerProfileType } from '../types/profile.types';

const EmployerProfile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');
  const { profile, isLoading, error } = useProfile();
  const { saveProfile, isSaving, hasUnsavedChanges } = useProfileUpdate();

  // Type guard to ensure we have an employer profile
  const employerProfile = profile?.role === 'employer' ? profile as EmployerProfileType : null;

  const handleTabChange = (tabId: ProfileTab) => {
    setActiveTab(tabId);
  };

  const handleSave = async () => {
    try {
      await saveProfile('save_draft');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const handlePublish = async () => {
    try {
      await saveProfile('publish');
    } catch (error) {
      console.error('Failed to publish profile:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Company Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Company Overview
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">🏢</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {employerProfile?.employerData?.companyName || 'Your Company'}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {employerProfile?.employerData?.industry || 'Industry not specified'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Company Size:</span>
                <span className="text-gray-900 dark:text-white">
                  {employerProfile?.employerData?.companySize || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Founded:</span>
                <span className="text-gray-900 dark:text-white">
                  {employerProfile?.employerData?.foundedYear || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Verified:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  employerProfile?.employerData?.isVerified 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                }`}>
                  {employerProfile?.employerData?.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Description</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {employerProfile?.employerData?.companyDescription || 
               'Add a company description to help candidates learn about your organization.'}
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</div>
            <div className="text-sm text-blue-600 dark:text-blue-400">Active Jobs</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">248</div>
            <div className="text-sm text-green-600 dark:text-green-400">Applications</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">15</div>
            <div className="text-sm text-purple-600 dark:text-purple-400">Interviews</div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">8</div>
            <div className="text-sm text-orange-600 dark:text-orange-400">Hires</div>
          </div>
        </div>
      </div>

      {/* Profile Completion Checklist */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profile Completion
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              employerProfile?.employerData?.companyName 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
            }`}>
              {employerProfile?.employerData?.companyName ? '✓' : '○'}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Company Information</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              employerProfile?.employerData?.companyDescription 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
            }`}>
              {employerProfile?.employerData?.companyDescription ? '✓' : '○'}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Company Description</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              employerProfile?.employerData?.companyLogo 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
            }`}>
              {employerProfile?.employerData?.companyLogo ? '✓' : '○'}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Company Logo</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              employerProfile?.employerData?.isVerified 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
            }`}>
              {employerProfile?.employerData?.isVerified ? '✓' : '○'}
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">Company Verification</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (!employerProfile) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            Please complete your employer profile setup.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'company':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProfileForm
              profile={employerProfile}
              section="company"
              isEditable={true}
            />
            <ProfilePreview
              profile={employerProfile}
              section="company"
            />
          </div>
        );
      case 'preview':
        return (
          <ProfilePreview
            profile={employerProfile}
            section="basic"
          />
        );
      default:
        return renderOverviewTab();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error loading profile: {error}</p>
      </div>
    );
  }

  return (
    <ProfileLayout
      activeTab={activeTab}
      onTabChange={handleTabChange}
    >
      <div className="p-6">
        {/* Action buttons for mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:hidden">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Employer Profile
          </h1>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving || !hasUnsavedChanges}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePublish}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Publishing...' : 'Publish Profile'}
            </motion.button>
          </div>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>
    </ProfileLayout>
  );
};

export default EmployerProfile;
