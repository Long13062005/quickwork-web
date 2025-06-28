/**
 * AuthGuard component
 * Handles authentication and profile completion checks
 */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchCurrentProfile } from '../features/profile/ProfileSlice';

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
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentProfile } = useAppSelector((state) => state.profile);

  useEffect(() => {
    // If authentication is required but user is not logged in
    if (requireAuth && !user) {
      navigate('/auth/login', { 
        replace: true,
        state: { from: location.pathname }
      });
      return;
    }

    // If user is logged in but we need to check profile completion
    if (user && requireProfile) {
      // Fetch profile data if not already loaded
      if (!currentProfile) {
        dispatch(fetchCurrentProfile());
        return;
      }

      // Check if profile is incomplete (no role assigned or basic info missing)
      const isProfileIncomplete = !currentProfile.role || 
                                  !currentProfile.firstName || 
                                  !currentProfile.lastName;

      if (isProfileIncomplete) {
        navigate('/auth/choose-role', { replace: true });
        return;
      }
    }

    // Special case: if user is on choose-role page but already has a complete profile
    if (location.pathname === '/auth/choose-role' && user && currentProfile) {
      const isProfileComplete = currentProfile.role && 
                               currentProfile.firstName && 
                               currentProfile.lastName;
      
      if (isProfileComplete) {
        // Redirect to appropriate profile page based on role
        const redirectPath = currentProfile.role === 'job_seeker' 
          ? '/profile/job-seeker' 
          : '/profile/employer';
        navigate(redirectPath, { replace: true });
        return;
      }
    }
  }, [user, currentProfile, requireAuth, requireProfile, navigate, location.pathname, dispatch]);

  return <>{children}</>;
};

export default AuthGuard;
