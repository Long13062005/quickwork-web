/**
 * AuthGuard component
 * Handles authentication and profile completion checks
 */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks';
// TODO: Re-import when profile module is rebuilt
// import { fetchCurrentProfile } from '../features/profile/ProfileSlice';
import { PageLoader } from './PageLoader';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
}

/**
 * AuthGuard component that handles authentication and profile completion logic
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = false, 
  requireProfile = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
  // TODO: Re-add profile state when profile module is rebuilt
  // const { currentProfile } = useAppSelector((state) => state.profile);

  // Wait for authentication initialization to complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  useEffect(() => {
    // If authentication is required but user is not logged in
    if (requireAuth && !isAuthenticated) {
      navigate('/auth/login', { 
        replace: true,
        state: { from: location.pathname }
      });
      return;
    }

    // TODO: Re-implement profile completion checks when profile module is rebuilt
    // If user is logged in but we need to check profile completion
    // if (user && requireProfile) {
    //   // Fetch profile data if not already loaded
    //   if (!currentProfile) {
    //     dispatch(fetchCurrentProfile());
    //     return;
    //   }

    //   // Check if profile is incomplete (no role assigned or basic info missing)
    //   const isProfileIncomplete = !currentProfile.role || 
    //                               !currentProfile.firstName || 
    //                               !currentProfile.lastName;

    //   if (isProfileIncomplete) {
    //     navigate('/auth/choose-role', { replace: true });
    //     return;
    //   }
    // }

    // TODO: Re-implement profile completion redirect when profile module is rebuilt
    // Special case: if user is on choose-role page but already has a complete profile
    // if (location.pathname === '/auth/choose-role' && user && currentProfile) {
    //   const isProfileComplete = currentProfile.role && 
    //                            currentProfile.firstName && 
    //                            currentProfile.lastName;
      
    //   if (isProfileComplete) {
    //     // Redirect to appropriate profile page based on role
    //     const redirectPath = currentProfile.role === 'job_seeker' 
    //       ? '/profile/job-seeker' 
    //       : '/profile/employer';
    //     navigate(redirectPath, { replace: true });
    //     return;
    //   }
    // }
  }, [isAuthenticated, requireAuth, requireProfile, navigate, location.pathname]);

  return <>{children}</>;
};

export default AuthGuard;
