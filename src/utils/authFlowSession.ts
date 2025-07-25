/**
 * Auth flow session utilities
 * Manages temporary session data for authentication flow
 */

const AUTH_FLOW_KEY = 'quickwork_auth_flow';

interface AuthFlowSession {
  email: string;
  timestamp: number;
  fromBeforeAuth: boolean;
}

/**
 * Session utilities for auth flow
 */
export const authFlowSession = {
  /**
   * Set auth flow session data
   */
  setSession: (email: string): void => {
    const sessionData: AuthFlowSession = {
      email,
      timestamp: Date.now(),
      fromBeforeAuth: true
    };
    
    try {
      sessionStorage.setItem(AUTH_FLOW_KEY, JSON.stringify(sessionData));
    } catch (error) {
      console.warn('Failed to set auth flow session:', error);
    }
  },

  /**
   * Get auth flow session data
   */
  getSession: (): AuthFlowSession | null => {
    try {
      const data = sessionStorage.getItem(AUTH_FLOW_KEY);
      if (!data) return null;
      
      const session: AuthFlowSession = JSON.parse(data);
      
      // Check if session is expired (30 minutes)
      const THIRTY_MINUTES = 30 * 60 * 1000;
      if (Date.now() - session.timestamp > THIRTY_MINUTES) {
        authFlowSession.clearSession();
        return null;
      }
      
      return session;
    } catch (error) {
      console.warn('Failed to get auth flow session:', error);
      return null;
    }
  },

  /**
   * Clear auth flow session data
   */
  clearSession: (): void => {
    try {
      sessionStorage.removeItem(AUTH_FLOW_KEY);
    } catch (error) {
      console.warn('Failed to clear auth flow session:', error);
    }
  },

  /**
   * Check if current session is valid for email
   */
  isValidSession: (email?: string): boolean => {
    const session = authFlowSession.getSession();
    if (!session) return false;
    
    if (email && session.email !== email) return false;
    
    return session.fromBeforeAuth;
  }
};

export default authFlowSession;
