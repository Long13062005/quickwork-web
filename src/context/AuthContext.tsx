import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FC, ReactNode } from 'react';
import { authAPI } from '../services/auth'; // Adjust the import path as necessary

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  isAuthenticated: false,
});

const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Start optimistic with HTTPOnly cookies
  const navigate = useNavigate();

  // With HTTPOnly cookies, we can't directly check auth status from frontend
  // We'll rely on API response codes to determine authentication status
  const checkAuthStatus = () => {
    // This will be updated based on API responses (403 = not authenticated)
    // Starting optimistic since HTTPOnly cookies are handled by browser automatically
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    await authAPI.login({ email, password });
    setIsAuthenticated(true);
  };

  const register = async (email: string, password: string) => {
    await authAPI.register({ email, password });
    setIsAuthenticated(true);
  };

  const logout = async () => {
    console.log('AuthContext: Starting logout process...');
    try {
      console.log('AuthContext: Calling authAPI.logout()...');
      const logoutPromise = authAPI.logout();
      
      // Set a timeout to ensure we don't wait forever if the backend is unresponsive
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Logout request timed out')), 5000);
      });
      
      // Race the logout request against a timeout
      await Promise.race([logoutPromise, timeoutPromise]);
      console.log('AuthContext: Backend logout successful, clearing local state...');
    } catch (error) {
      // Even if logout API fails, continue with local cleanup
      console.warn('AuthContext: Logout API call failed, but proceeding with cleanup:', error);
    } finally {
      // Always clear local state and navigate, regardless of API success/failure
      console.log('AuthContext: Clearing local state...');
      setIsAuthenticated(false);
      
      // Small delay before navigation to ensure any UI updates complete
      setTimeout(() => {
        console.log('AuthContext: Navigating to /auth...');
        navigate('/auth');
        console.log('AuthContext: Logout process completed');
      }, 100);
    }
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;