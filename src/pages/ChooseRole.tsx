/**
 * Choose Role page - appears after successful registration
 * Allows users to select between Job Seeker and Employer roles
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
// TODO: Re-import when profile module is rebuilt
// import { createLocalProfile } from '../features/profile/ProfileSlice';
import { ThemeToggle } from '../components/ThemeToggle';
import QuickworkLogo from '../assets/Quickwork_logo.png';
import toast from 'react-hot-toast';
import type { UserRole } from '../features/profile/types/profile.types';

/**
 * Choose Role component for post-registration role selection
 */
export default function ChooseRole(): React.JSX.Element {
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  // TODO: Re-add profile state when profile module is rebuilt
  // const { currentProfile } = useAppSelector((state) => state.profile);
  const [isSelecting, setIsSelecting] = useState(false);

  // Redirect if not authenticated (shouldn't happen, but safety check)
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // TODO: Re-implement when profile module is rebuilt
  // Redirect if user already has a role/profile (prevent role changing)
  // React.useEffect(() => {
  //   if (currentProfile && currentProfile.role) {
  //     console.log('User already has a role:', currentProfile.role);
  //     toast('You have already chosen your role and cannot change it.', {
  //       icon: 'ℹ️',
  //       duration: 4000,
  //     });
      
  //     // Redirect to appropriate profile page or dashboard
  //     const redirectRoute = currentProfile.role === 'job_seeker' 
  //       ? '/profile/job-seeker' 
  //       : '/profile/employer';
      
  //     navigate(redirectRoute, { replace: true });
  //   }
  // }, [currentProfile, navigate]);

  const handleRoleSelection = async (role: 'job-seeker' | 'employer') => {
    if (isSelecting) return; // Prevent double-clicks
    
    setIsSelecting(true);
    
    try {
      // TODO: Re-implement profile creation with selected role when profile module is rebuilt
      // Create a basic profile with the selected role (LOCAL STATE ONLY - NO API CALL)
      // const profileData = {
      //   firstName: user?.fullName?.split(' ')[0] || '',
      //   lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
      //   email: user?.email || '',
      //   title: '', // Professional title - to be filled in profile form
      //   bio: '',
      //   location: {
      //     city: '',
      //     state: '',
      //     country: '',
      //     timezone: 'UTC'
      //   }
      // };

      const roleMap: Record<string, UserRole> = {
        'job-seeker': 'jobseeker',
        'employer': 'employer'
      };

      const actualRole = roleMap[role] || role as UserRole;
      
      // TODO: Re-implement profile creation when profile module is rebuilt
      // Store the role and basic data in Redux state (NO API CALL YET)
      // const result = await dispatch(createLocalProfile({ 
      //   role: actualRole, 
      //   profileData: profileData as any 
      // }));

      // if (createLocalProfile.fulfilled.match(result)) {
        toast.success(`Role selected! Complete your ${actualRole === 'jobseeker' ? 'Job Seeker' : 'Employer'} profile to continue.`);
        // Navigate to the appropriate profile page to fill out details
        navigate(`/profile/${role}`, { replace: true });
      // } else {
      //   throw new Error(result.payload as string || 'Failed to create profile');
      // }
    } catch (error: any) {
      console.error('Profile creation failed:', error);
      toast.error('Failed to create profile. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 flex items-center justify-center p-4">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.img
            src={QuickworkLogo}
            alt="Quickwork"
            className="h-16 w-auto mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-4"
          >
            Welcome to Quickwork! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-zinc-600 dark:text-zinc-300 mb-2"
          >
            Welcome!
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg text-zinc-600 dark:text-zinc-300"
          >
            Let's set up your profile. Are you looking to hire or find work?
          </motion.p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Seeker Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelection('job-seeker')}
            className={`bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg cursor-pointer border-2 border-transparent hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 group ${
              isSelecting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6.5" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                I'm looking for work
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                Create your professional profile, showcase your skills, and connect with top employers.
              </p>
              
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Continue as Job Seeker →
              </div>
            </div>
          </motion.div>

          {/* Employer Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelection('employer')}
            className={`bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg cursor-pointer border-2 border-transparent hover:border-purple-500 dark:hover:border-purple-400 transition-all duration-300 group ${
              isSelecting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 transition-colors">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
                I'm looking to hire
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-300 mb-6">
                Build your company profile, post jobs, and find the perfect candidates for your team.
              </p>
              
              <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Continue as Employer →
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-8"
        >
          {isSelecting ? (
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Creating your profile... ⏳
            </p>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Choose carefully - your role cannot be changed once your profile is saved.
            </p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
