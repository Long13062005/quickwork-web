/**
 * ProfileHeader component
 * Header bar with profile info, save status, and navigation controls
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Profile } from '../types/profile.types';

/**
 * Props interface
 */
interface ProfileHeaderProps {
  profile: Profile | null;
  hasUnsavedChanges: boolean;
  isAutoSaving: boolean;
  lastSaved: Date | null;
  onToggleSidebar: () => void;
}

/**
 * ProfileHeader component
 */
export function ProfileHeader({
  profile,
  hasUnsavedChanges,
  isAutoSaving,
  lastSaved,
  onToggleSidebar,
}: ProfileHeaderProps): React.JSX.Element {
  
  /**
   * Get profile completion percentage (mock calculation)
   */
  const getCompletionPercentage = (): number => {
    if (!profile) return 0;
    
    let completed = 0;
    const total = 10; // Total number of key fields to check
    
    // Basic info checks
    if (profile.firstName) completed++;
    if (profile.lastName) completed++;
    if (profile.email) completed++;
    if (profile.bio) completed++;
    if (profile.location?.city) completed++;
    
    // Role-specific checks
    if (profile.role === 'job_seeker') {
      if (profile.jobSeekerData?.title) completed++;
      if (profile.jobSeekerData?.summary) completed++;
      if (profile.jobSeekerData?.skills?.length > 0) completed++;
      if (profile.jobSeekerData?.experience?.length > 0) completed++;
      if (profile.jobSeekerData?.education?.length > 0) completed++;
    } else if (profile.role === 'employer') {
      if (profile.employerData?.companyName) completed++;
      if (profile.employerData?.companyDescription) completed++;
      if (profile.employerData?.industry) completed++;
      if (profile.employerData?.companySize) completed++;
      if (profile.employerData?.benefits?.length > 0) completed++;
    }
    
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-zinc-800 border-b border-gray-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Profile Info */}
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                {profile ? (
                  profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`.toUpperCase()
                  )
                ) : (
                  '?'
                )}
              </div>
              
              {/* Status indicator */}
              <div className={`
                absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-800
                ${profile?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}
              `} />
            </div>

            {/* Name and Role */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Loading...'}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 capitalize">
                {profile?.role?.replace('_', ' ') || 'Profile'}
              </p>
            </div>
          </div>
        </div>

        {/* Center Section - Completion Progress */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            Profile Completion
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  completionPercentage >= 80
                    ? 'bg-green-500'
                    : completionPercentage >= 50
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {completionPercentage}%
            </span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm">
            {isAutoSaving ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 text-blue-600 dark:text-blue-400"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                />
                <span className="hidden sm:inline">Auto-saving...</span>
              </motion.div>
            ) : hasUnsavedChanges ? (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <span className="hidden sm:inline">Unsaved changes</span>
              </div>
            ) : lastSaved ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Saved</span>
              </div>
            ) : null}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Preview Button */}
            <Link
              to={`/profile/${profile?.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 border border-gray-300 dark:border-zinc-600 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span className="hidden sm:inline">Preview</span>
            </Link>

            {/* Settings Menu */}
            <div className="relative">
              <button className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors">
                <svg className="w-4 h-4 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
