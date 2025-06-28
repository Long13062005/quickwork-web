/**
 * ProfileLayout component
 * Main layout wrapper with navigation tabs for profile management
 */

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useProfile } from '../hooks/useProfile';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { ProfileHeader } from './ProfileHeader';
import type { ProfileTab, UserRole } from '../types/profile.types';

/**
 * Tab configuration for different user roles
 */
const TAB_CONFIGS: Record<UserRole, ProfileTab[]> = {
  job_seeker: [
    'overview',
    'basic-info',
    'professional',
    'experience',
    'education',
    'projects',
    'certifications',
    'preferences',
    'preview',
  ],
  employer: [
    'overview',
    'basic-info',
    'company',
    'preview',
  ],
};

/**
 * Tab metadata
 */
const TAB_METADATA: Record<ProfileTab, {
  label: string;
  icon: string;
  description: string;
}> = {
  overview: {
    label: 'Overview',
    icon: '📊',
    description: 'Profile completion and quick stats',
  },
  'basic-info': {
    label: 'Basic Info',
    icon: '👤',
    description: 'Personal information and contact details',
  },
  professional: {
    label: 'Professional',
    icon: '💼',
    description: 'Skills, experience level, and career goals',
  },
  experience: {
    label: 'Experience',
    icon: '🏢',
    description: 'Work history and achievements',
  },
  education: {
    label: 'Education',
    icon: '🎓',
    description: 'Educational background and qualifications',
  },
  projects: {
    label: 'Projects',
    icon: '🚀',
    description: 'Personal and professional projects',
  },
  certifications: {
    label: 'Certifications',
    icon: '🏆',
    description: 'Professional certifications and licenses',
  },
  preferences: {
    label: 'Preferences',
    icon: '⚙️',
    description: 'Job preferences and availability',
  },
  company: {
    label: 'Company',
    icon: '🏭',
    description: 'Company information and culture',
  },
  preview: {
    label: 'Preview',
    icon: '👁️',
    description: 'Preview your public profile',
  },
};

/**
 * Props interface
 */
interface ProfileLayoutProps {
  children: React.ReactNode;
  activeTab?: ProfileTab;
  onTabChange?: (tab: ProfileTab) => void;
  className?: string;
}

/**
 * ProfileLayout component
 */
export function ProfileLayout({
  children,
  activeTab = 'overview',
  onTabChange,
  className = '',
}: ProfileLayoutProps): React.JSX.Element {
  const { profile, isLoading } = useProfile();
  const { hasUnsavedChanges, isAutoSaving, lastSaved } = useProfileUpdate();
  const shouldReduceMotion = useReducedMotion() ?? false;
  
  // Local state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Get available tabs based on user role
  const availableTabs = profile?.role ? TAB_CONFIGS[profile.role] : TAB_CONFIGS.job_seeker;

  // Handle tab change
  const handleTabChange = (tab: ProfileTab) => {
    onTabChange?.(tab);
    setShowMobileSidebar(false); // Close mobile sidebar on tab change
  };

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowMobileSidebar(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-zinc-900 ${className}`}>
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        hasUnsavedChanges={hasUnsavedChanges}
        isAutoSaving={isAutoSaving}
        lastSaved={lastSaved}
        onToggleSidebar={() => setShowMobileSidebar(!showMobileSidebar)}
      />

      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {showMobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            width: isSidebarCollapsed ? 80 : 280,
            x: showMobileSidebar ? 0 : '-100%',
          }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className={`
            fixed lg:relative inset-y-0 left-0 z-50 lg:z-0
            bg-white dark:bg-zinc-800 border-r border-gray-200 dark:border-zinc-700
            ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            transition-transform duration-300 lg:transition-none
          `}
          style={{ top: '64px' }} // Account for header height
        >
          <div className="h-full flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700">
              {!isSidebarCollapsed && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-lg font-semibold text-zinc-900 dark:text-white"
                >
                  Profile Settings
                </motion.h2>
              )}
              <button
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
                aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <motion.svg
                  animate={{ rotate: isSidebarCollapsed ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </motion.svg>
              </button>
            </div>

            {/* Navigation Tabs */}
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
              {availableTabs.map((tab, index) => {
                const metadata = TAB_METADATA[tab];
                const isActive = activeTab === tab;

                return (
                  <motion.button
                    key={tab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTabChange(tab)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                      transition-all duration-200 group
                      ${isActive 
                        ? 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-200'
                      }
                    `}
                  >
                    <span className="text-lg flex-shrink-0">{metadata.icon}</span>
                    
                    {!isSidebarCollapsed && (
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{metadata.label}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate">
                          {metadata.description}
                        </p>
                      </div>
                    )}

                    {!isSidebarCollapsed && isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border-t border-gray-200 dark:border-zinc-700"
              >
                <div className="text-xs text-zinc-500 dark:text-zinc-500 space-y-1">
                  <p>💡 Tip: Complete your profile to increase visibility</p>
                  {lastSaved && (
                    <p>
                      Last saved: {new Intl.DateTimeFormat('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      }).format(lastSaved)}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="h-full p-4 lg:p-6">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
