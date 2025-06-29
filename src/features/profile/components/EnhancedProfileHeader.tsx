/**
 * Enhanced Profile header component with role indicator and completion status
 * Shows user avatar, name, role badge, and profile completion progress
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks';
import { resetProfileState } from '../ProfileSlice';
import { ThemeToggle } from '../../../components/ThemeToggle';
import { AvatarUpload } from '../../../components/AvatarUpload';
import type { Profile, EmployerProfile } from '../types/profile.types';

interface EnhancedProfileHeaderProps {
  profile: Profile;
  completionPercentage: number;
  isEditing: boolean;
  onEditToggle: () => void;
  onExportProfile?: () => void;
  onSubmitProfile?: () => void;
  canSubmit?: boolean;
  isSubmitting?: boolean;
}

/**
 * Enhanced Profile header with role indicator and completion status
 */
export const EnhancedProfileHeader: React.FC<EnhancedProfileHeaderProps> = ({
  profile,
  completionPercentage,
  isEditing,
  onEditToggle,
  onExportProfile,
  onSubmitProfile,
  canSubmit = false,
  isSubmitting = false
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const isJobSeeker = profile.role === 'job_seeker';
  const isEmployer = profile.role === 'employer';

  // Handle role change with confirmation
  const handleChangeRole = () => {
    setShowConfirmDialog(true);
  };

  const confirmRoleChange = () => {
    // Clear the current profile state
    dispatch(resetProfileState());
    // Navigate back to role selection
    navigate('/auth/choose-role', { replace: true });
    setShowConfirmDialog(false);
  };

  const cancelRoleChange = () => {
    setShowConfirmDialog(false);
  };

  const getRoleConfig = () => {
    if (isJobSeeker) {
      return {
        label: 'Job Seeker',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-200 dark:border-blue-800',
        icon: '👤'
      };
    }
    
    return {
      label: 'Employer',
      bgColor: 'bg-green-50 dark:bg-green-950/20',
      textColor: 'text-green-700 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      icon: '🏢'
    };
  };

  const roleConfig = getRoleConfig();

  const getCompletionStatus = () => {
    if (completionPercentage >= 90) {
      return {
        status: 'complete',
        color: 'text-green-600 dark:text-green-400',
        bgColor: 'bg-green-500',
        message: 'Profile Complete',
        icon: '✅'
      };
    } else if (completionPercentage >= 50) {
      return {
        status: 'partial',
        color: 'text-yellow-600 dark:text-yellow-400',
        bgColor: 'bg-yellow-500',
        message: 'Almost There',
        icon: '⚠️'
      };
    }
    
    return {
      status: 'incomplete',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-500',
      message: 'Needs Attention',
      icon: '❗'
    };
  };

  const completionStatus = getCompletionStatus();

  // Get display name based on role
  const getDisplayName = () => {
    if (isEmployer) {
      const employerProfile = profile as EmployerProfile;
      return employerProfile.employerData?.companyName || `${profile.firstName} ${profile.lastName}`;
    }
    return `${profile.firstName} ${profile.lastName}`;
  };

  const getContactInfo = () => {
    const info = [];
    if (profile.email) info.push(profile.email);
    if (profile.phone) info.push(profile.phone);
    if (profile.location) {
      const location = `${profile.location.city}, ${profile.location.state}`;
      if (location !== ', ') info.push(location);
    }
    return info;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-8 mb-8"
    >
      {/* Role Indicator Badge */}
      <div className="flex justify-between items-start mb-6">
        <div className={`
          inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
          ${roleConfig.bgColor} ${roleConfig.textColor} ${roleConfig.borderColor} border
        `}>
          <span className="mr-2" aria-hidden="true">{roleConfig.icon}</span>
          {roleConfig.label}
        </div>

        <div className="flex items-center space-x-3">
          {/* Theme Toggle */}
          <ThemeToggle variant="profile" />

          {/* Change Role Button */}
          <button
            onClick={handleChangeRole}
            className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 
                     hover:text-gray-900 dark:hover:text-gray-100 
                     border border-gray-300 dark:border-gray-600 rounded-lg
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Change role selection"
            title="Change your role (Job Seeker/Employer)"
          >
            <span className="mr-2" aria-hidden="true">🔄</span>
            Change Role
          </button>

          {onSubmitProfile && canSubmit && (
            <button
              onClick={onSubmitProfile}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white
                       bg-green-600 hover:bg-green-700 disabled:bg-green-400
                       border border-green-600 rounded-lg
                       hover:shadow-md transition-all duration-200
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                       disabled:cursor-not-allowed"
              aria-label="Submit completed profile"
              title="Submit your completed profile"
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2" aria-hidden="true">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  <span className="mr-2" aria-hidden="true">✅</span>
                  Submit Profile
                </>
              )}
            </button>
          )}

          {onExportProfile && (
            <button
              onClick={onExportProfile}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 
                       hover:text-blue-700 dark:hover:text-blue-300
                       border border-blue-300 dark:border-blue-600 rounded-lg
                       hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Export profile as JSON"
              title="Export profile as JSON"
            >
              <span className="mr-2" aria-hidden="true">📄</span>
              Export
            </button>
          )}
          
          <button
            onClick={onEditToggle}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 
                     hover:text-gray-900 dark:hover:text-gray-100 
                     border border-gray-300 dark:border-gray-600 rounded-lg
                     hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={isEditing ? 'Cancel editing profile' : 'Edit profile'}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Profile Information */}
      <div className="flex items-start space-x-6">
        {/* Avatar with Upload */}
        <div className="relative">
          <AvatarUpload 
            profile={profile}
            size="xl"
            showProgressBar={true}
            showDeleteButton={true}
            className="shadow-lg"
          />
          
          {/* Profile completion indicator */}
          <div 
            className={`
              absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs
              ${completionStatus.bgColor} shadow-lg border-2 border-white dark:border-gray-800
            `}
            aria-label={`Profile completion: ${completionStatus.message}`}
          >
            <span className="text-white" aria-hidden="true">{completionStatus.icon}</span>
          </div>
        </div>

        {/* Name and Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getDisplayName() || 'Complete Your Profile'}
          </h1>
          
          {isEmployer && (profile as EmployerProfile).employerData?.companyName && profile.firstName && (
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Contact: {profile.firstName} {profile.lastName}
            </p>
          )}

          {profile.bio && (
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed text-lg">
              {profile.bio.length > 120 
                ? `${profile.bio.substring(0, 120)}...` 
                : profile.bio
              }
            </p>
          )}

          {/* Contact Information */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            {getContactInfo().map((info, index) => (
              <span key={index}>
                {index > 0 && <span aria-hidden="true">• </span>}
                {info}
              </span>
            ))}
            {isEmployer && (profile as EmployerProfile).employerData?.companyWebsite && (
              <a 
                href={(profile as EmployerProfile).employerData?.companyWebsite} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:underline"
              >
                <span aria-hidden="true">• </span>Website
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Profile Completion Progress */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Profile Completion
          </span>
          <span className={`text-sm font-medium ${completionStatus.color}`}>
            {completionPercentage}% • {completionStatus.message}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100}>
          <motion.div
            className={`h-2 rounded-full ${
              completionPercentage >= 90 ? 'bg-green-500' :
              completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Role Change Confirmation Dialog */}
      {showConfirmDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={cancelRoleChange}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 m-4 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl" aria-hidden="true">⚠️</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Change Your Role?
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to change your role? All your current profile progress will be lost and you'll need to start over.
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={cancelRoleChange}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 
                           hover:text-gray-900 dark:hover:text-gray-100 
                           border border-gray-300 dark:border-gray-600 rounded-lg
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                
                <button
                  onClick={confirmRoleChange}
                  className="px-4 py-2 text-sm font-medium text-white
                           bg-red-600 hover:bg-red-700 
                           border border-red-600 rounded-lg
                           hover:shadow-md transition-all duration-200
                           focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Yes, Change Role
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
