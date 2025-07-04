/**
 * AppInitializer component
 * Handles app initialization and authentication restoration from cookies
 */
import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { checkAuthStatus } from '../features/auth/AuthSlice';
import { PageLoader } from './PageLoader';

interface AppInitializerProps {
  children: React.ReactNode;
}

/**
 * Component that handles app initialization and authentication restoration
 * This ensures that authentication state is restored from cookies on page reload
 */
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Check authentication status on app startup
    if (!isInitialized) {
      console.log('🔄 Initializing app - checking authentication status...');
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isInitialized]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  console.log('✅ App initialization complete');
  return <>{children}</>;
};

export default AppInitializer;
