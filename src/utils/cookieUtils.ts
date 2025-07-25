/**
 * Cookie utility functions for HTTPOnly cookie authentication
 * Provides consistent cookie management across the application
 */

/**
 * Clear authentication cookies with multiple approaches to ensure complete removal
 * Note: HTTPOnly cookies cannot be accessed or cleared by JavaScript
 * This function only clears non-HTTPOnly cookies as a fallback
 * Primary cookie clearing should be done by the backend on logout
 */
export const clearAuthCookies = (): void => {
  // Common cookie names that might be used (excluding HTTPOnly auth cookies)
  const cookiesToClear = ['refreshToken', 'accessToken', 'sessionId', 'userPrefs', 'theme'];
  const pathsToTry = ['/', '/auth', '/profile'];
  const isSecure = window.location.protocol === 'https:';
  
  console.log('clearAuthCookies: Starting cookie clearing process...');
  console.log('clearAuthCookies: Environment:', isSecure ? 'HTTPS (secure)' : 'HTTP (non-secure)');
  console.log('clearAuthCookies: Note - HTTPOnly cookies can only be cleared by the backend');
  
  cookiesToClear.forEach(cookieName => {
    pathsToTry.forEach(path => {
      // Method 1: Clear secure cookies (for HTTPS environments)
      if (isSecure) {
        document.cookie = `${cookieName}=; path=${path}; max-age=0; secure; samesite=strict`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=0; secure; samesite=strict`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=0; secure; samesite=lax`;
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=0; secure; samesite=none`;
      }
      
      // Method 2: Clear non-secure cookies (for HTTP environments or fallback)
      document.cookie = `${cookieName}=; path=${path}; max-age=0`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=0`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=0; samesite=strict`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; max-age=0; samesite=lax`;
      
      // Method 3: Legacy approach without samesite
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
    });
    
    console.log(`clearAuthCookies: Cleared cookie: ${cookieName} (${isSecure ? 'secure' : 'non-secure'} mode)`);
  });
  
  console.log('clearAuthCookies: Non-HTTPOnly cookies cleared');
  console.log('clearAuthCookies: HTTPOnly auth cookies will be cleared by backend logout endpoint');
  
  // Log remaining cookies for debugging (HTTPOnly cookies won't be visible)
  const remainingCookies = document.cookie;
  console.log('clearAuthCookies: Remaining visible cookies:', remainingCookies || '(none visible - HTTPOnly cookies are hidden)');
};

/**
 * Check if any authentication cookies exist
 * @returns boolean indicating if auth cookies are present
 */
export const hasAuthCookies = (): boolean => {
  const cookies = document.cookie.split(';');
  const authCookies = ['refreshToken', 'accessToken', 'sessionId'];
  
  return authCookies.some(cookieName => 
    cookies.some(cookie => cookie.trim().startsWith(`${cookieName}=`))
  );
};

/**
 * Get a specific cookie value
 * @param name - Cookie name to retrieve
 * @returns Cookie value or null if not found
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

/**
 * Set a cookie with appropriate security settings based on environment
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAge - Max age in seconds (optional)
 */
export const setSecureCookie = (name: string, value: string, maxAge?: number): void => {
  const isSecure = window.location.protocol === 'https:';
  let cookieString = `${name}=${value}; path=/`;
  
  // Add security flags for HTTPS environments
  if (isSecure) {
    cookieString += '; secure; samesite=strict';
  } else {
    // For HTTP environments (development), use less restrictive settings
    cookieString += '; samesite=lax';
  }
  
  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  }
  
  document.cookie = cookieString;
  console.log(`Set ${isSecure ? 'secure' : 'non-secure'} cookie: ${name}`);
};
