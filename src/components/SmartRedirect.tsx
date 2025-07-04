/**
 * SmartRedirect component
 * Intelligently redirects users based on their authentication and profile status
 */
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PageLoader } from './PageLoader';

/**
 * Smart redirect component that sends users to appropriate page based on auth state
 * Flow: Check /auth/me -> if 200, check /profile/me -> if 404 create profile, if 200 go to dashboard
 */
export const SmartRedirect: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'unauthenticated' | 'no-profile' | 'has-profile'>('loading');
  const [dashboardUrl, setDashboardUrl] = useState('/dashboard');

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      try {
        console.log('SmartRedirect: Step 1 - Checking authentication status...');
        
        // Step 1: Check authentication
        const authResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:1010/api'}/auth/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (authResponse.status !== 200) {
          console.log('SmartRedirect: User not authenticated - redirecting to auth');
          setStatus('unauthenticated');
          return;
        }

        console.log('SmartRedirect: User authenticated (200) - Step 2: Checking profile...');
        
        // Step 2: Check profile
        const profileResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:1010/api'}/profile/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (profileResponse.status === 404) {
          console.log('SmartRedirect: No profile found (404) - redirecting to create profile');
          setStatus('no-profile');
        } else if (profileResponse.status === 200) {
          console.log('SmartRedirect: Profile found (200) - determining dashboard...');
          
          // Get profile data to determine correct dashboard
          const profileData = await profileResponse.json();
          console.log('SmartRedirect: Profile data received:', profileData);
          
          let targetUrl = '/dashboard'; // Default for job seekers
          
          if (profileData.profileType === 'EMPLOYER') {
            console.log('SmartRedirect: Redirecting to employer dashboard');
            targetUrl = '/employer/dashboard';
          } else if (profileData.profileType === 'ADMIN') {
            console.log('SmartRedirect: Redirecting to admin dashboard');
            targetUrl = '/admin/dashboard';
          } else {
            console.log('SmartRedirect: Redirecting to job seeker dashboard (default)');
          }
          
          setDashboardUrl(targetUrl);
          setStatus('has-profile');
        } else {
          console.log('SmartRedirect: Profile check failed with status:', profileResponse.status);
          setStatus('no-profile'); // Default to profile creation if unclear
        }
      } catch (error) {
        console.error('SmartRedirect: Auth/Profile check failed:', error);
        setStatus('unauthenticated');
      }
    };

    checkAuthAndProfile();
  }, []);

  // Show loading while checking authentication and profile
  if (status === 'loading') {
    return <PageLoader />;
  }

  // If not authenticated, go to auth page
  if (status === 'unauthenticated') {
    return <Navigate to="/auth" replace />;
  }

  // If authenticated but no profile (404), go to create profile
  if (status === 'no-profile') {
    return <Navigate to="/auth/choose-role" replace />;
  }

  // If authenticated and has profile (200), go to appropriate dashboard
  if (status === 'has-profile') {
    return <Navigate to={dashboardUrl} replace />;
  }
  
  // Fallback to job seeker dashboard
  return <Navigate to="/dashboard" replace />;
};

export default SmartRedirect;
