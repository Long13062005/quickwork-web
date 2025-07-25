/**
 * AuthFlowGuard component
 * Ensures users follow the proper authentication flow: BeforeAuth -> Login/Register
 */
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authFlowSession } from '../utils/authFlowSession';

interface AuthFlowGuardProps {
  children: React.ReactNode;
  requireEmailCheck?: boolean;
}

/**
 * AuthFlowGuard component that enforces the authentication flow
 */
export const AuthFlowGuard: React.FC<AuthFlowGuardProps> = ({ 
  children, 
  requireEmailCheck = false 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if this route requires email check (login/register pages)
    if (requireEmailCheck) {
      // Check if user came from BeforeAuth with proper state
      const hasEmailFromBeforeAuth = location.state?.email;
      
      // Fallback: check session storage
      const sessionData = authFlowSession.getSession();
      const hasValidSession = sessionData && authFlowSession.isValidSession(location.state?.email);
      
      // If no email state and no valid session, redirect to BeforeAuth
      if (!hasEmailFromBeforeAuth && !hasValidSession) {
        toast.error('Please start by entering your email address');
        navigate('/auth', { replace: true });
        return;
      }

      // If we have session but no state, update the location state
      if (!hasEmailFromBeforeAuth && hasValidSession && sessionData) {
        // Update the browser state to include email from session
        window.history.replaceState(
          { ...location.state, email: sessionData.email }, 
          '', 
          location.pathname
        );
      }

      // Additional validation: ensure email is valid format
      const email = location.state?.email || sessionData?.email;
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast.error('Invalid email format. Please try again.');
          authFlowSession.clearSession();
          navigate('/auth', { replace: true });
          return;
        }
      }
    }
  }, [requireEmailCheck, location.state, location.pathname, navigate]);

  // If we need email check but don't have it in state or session, show loading while redirecting
  if (requireEmailCheck && !location.state?.email && !authFlowSession.isValidSession()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthFlowGuard;
