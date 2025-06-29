/**
 * Enhanced EmployerProfile component
 * Modern, accessible profile management interface for employers
 */

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedProfileHeader } from './EnhancedProfileHeader';
import { RoleBasedProfileForm } from './RoleBasedProfileForm';
import { useProfile } from '../hooks/useProfile';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { calculateProfileCompletion, getMissingProfileFields } from '../utils/profileCompletion';
import type { EmployerProfile as EmployerProfileType } from '../types/profile.types';

/**
 * Company Stats component for employer overview
 */
interface CompanyStatsProps {
  stats: {
    activeJobs: number;
    applications: number;
    interviews: number;
    hires: number;
  };
}

const CompanyStats: React.FC<CompanyStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <motion.div 
      className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400" aria-label={`${stats.activeJobs} active jobs`}>
        {stats.activeJobs}
      </div>
      <div className="text-sm text-blue-600 dark:text-blue-400">Active Jobs</div>
    </motion.div>
    
    <motion.div 
      className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-2xl font-bold text-green-600 dark:text-green-400" aria-label={`${stats.applications} applications received`}>
        {stats.applications}
      </div>
      <div className="text-sm text-green-600 dark:text-green-400">Applications</div>
    </motion.div>
    
    <motion.div 
      className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400" aria-label={`${stats.interviews} interviews scheduled`}>
        {stats.interviews}
      </div>
      <div className="text-sm text-purple-600 dark:text-purple-400">Interviews</div>
    </motion.div>
    
    <motion.div 
      className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400" aria-label={`${stats.hires} successful hires`}>
        {stats.hires}
      </div>
      <div className="text-sm text-orange-600 dark:text-orange-400">Hires</div>
    </motion.div>
  </div>
);

/**
 * Company Overview section
 */
interface CompanyOverviewProps {
  profile: EmployerProfileType;
}

const CompanyOverview: React.FC<CompanyOverviewProps> = ({ profile }) => {
  const { employerData } = profile;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Company Overview
        </h3>
        {employerData.isVerified && (
          <div className="flex items-center space-x-2 px-3 py-1 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 rounded-full border border-green-200 dark:border-green-800">
            <span className="text-sm">✓</span>
            <span className="text-sm font-medium">Verified Company</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Company Info */}
        <div>
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              {employerData.companyLogo ? (
                <img 
                  src={employerData.companyLogo} 
                  alt={`${employerData.companyName} logo`}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <span className="text-white text-2xl" aria-hidden="true">🏢</span>
              )}
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                {employerData.companyName || 'Your Company'}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {employerData.industry || 'Industry not specified'}
              </p>
              {employerData.companyWebsite && (
                <a 
                  href={employerData.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  aria-label={`Visit ${employerData.companyName} website`}
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Company Size:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {employerData.companySize || 'Not specified'}
              </span>
            </div>
            
            {employerData.foundedYear && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Founded:</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {employerData.foundedYear}
                </span>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Location:</span>
              <span className="text-gray-900 dark:text-white font-medium">
                {employerData.headquarters ? 
                  `${employerData.headquarters.city}, ${employerData.headquarters.state}` : 
                  'Not specified'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Company Description */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">About Us</h4>
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {employerData.companyDescription || 
               'Add a compelling company description to attract top talent and showcase your organization\'s mission and values.'}
            </p>
          </div>
          
          {/* Tech Stack */}
          {employerData.techStack && employerData.techStack.length > 0 && (
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">Tech Stack</h5>
              <div className="flex flex-wrap gap-2">
                {employerData.techStack.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 rounded-full text-sm border border-blue-200 dark:border-blue-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Profile Completion Checklist for employers
 */
interface ProfileCompletionChecklistProps {
  profile: EmployerProfileType;
  missingFields: string[];
  completionPercentage: number;
}

const ProfileCompletionChecklist: React.FC<ProfileCompletionChecklistProps> = ({ 
  profile, 
  missingFields, 
  completionPercentage 
}) => {
  const { employerData } = profile;
  
  const completionItems = [
    {
      label: 'Company Information',
      completed: !!(employerData.companyName && employerData.industry && employerData.companySize),
      description: 'Basic company details'
    },
    {
      label: 'Company Description',
      completed: !!(employerData.companyDescription && employerData.companyDescription.length > 50),
      description: 'Detailed company overview'
    },
    {
      label: 'Company Logo',
      completed: !!employerData.companyLogo,
      description: 'Professional company logo'
    },
    {
      label: 'Contact Information',
      completed: !!(profile.phone && profile.email),
      description: 'Phone and email'
    },
    {
      label: 'Location Details',
      completed: !!(employerData.headquarters?.city && employerData.headquarters?.state),
      description: 'Company headquarters'
    }
  ];

  return (
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
      
      <div className="space-y-3">
        {completionItems.map((item, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
              item.completed 
                ? 'bg-green-100 text-green-600 dark:bg-green-950/20 dark:text-green-400 border-2 border-green-200 dark:border-green-800' 
                : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-600'
            }`}>
              {item.completed ? '✓' : '○'}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {item.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {item.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {missingFields.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>To complete your profile:</strong> {missingFields.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

/**
 * Main EmployerProfile component
 */
const EnhancedEmployerProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'edit'>('overview');
  
  const { profile, isLoading, error } = useProfile();
  const { saveProfile, isSaving } = useProfileUpdate();

  // Type guard to ensure we have an employer profile
  const employerProfile = profile?.role === 'employer' ? profile as EmployerProfileType : null;

  const completionPercentage = employerProfile ? calculateProfileCompletion(employerProfile) : 0;
  const missingFields = employerProfile ? getMissingProfileFields(employerProfile) : [];

  const handleEditToggle = useCallback(() => {
    setIsEditing(!isEditing);
    setActiveSection(isEditing ? 'overview' : 'edit');
  }, [isEditing]);

  const handleSaveProfile = useCallback(async () => {
    if (!employerProfile) return;
    
    try {
      await saveProfile('save_draft');
      setIsEditing(false);
      setActiveSection('overview');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  }, [saveProfile, employerProfile]);

  // Mock stats - in real app, this would come from API
  const companyStats = {
    activeJobs: 12,
    applications: 248,
    interviews: 15,
    hires: 8
  };

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

  if (!employerProfile) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            Profile Setup Required
          </h2>
          <p className="text-yellow-700 dark:text-yellow-300">
            Please complete your employer profile setup to continue.
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
          profile={employerProfile}
          completionPercentage={completionPercentage}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
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
                className="space-y-6"
              >
                {/* Company Overview */}
                <CompanyOverview profile={employerProfile} />
                
                {/* Company Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Company Statistics
                  </h3>
                  <CompanyStats stats={companyStats} />
                </div>

                {/* Profile Completion */}
                <ProfileCompletionChecklist
                  profile={employerProfile}
                  missingFields={missingFields}
                  completionPercentage={completionPercentage}
                />
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
                  profile={employerProfile}
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

export default EnhancedEmployerProfile;
