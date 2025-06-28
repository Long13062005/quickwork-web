/**
 * ProtectedRoute component
 * Wrapper for routes that require authentication and/or profile completion
 */
import React from 'react';
import { AuthGuard } from './AuthGuard';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
}

/**
 * ProtectedRoute component that wraps AuthGuard
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireProfile = false 
}) => {
  return (
    <AuthGuard requireAuth={requireAuth} requireProfile={requireProfile}>
      {children}
    </AuthGuard>
  );
};

export default ProtectedRoute;
