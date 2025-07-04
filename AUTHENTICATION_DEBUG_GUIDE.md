# Authentication Debugging & 403 Error Resolution Guide

## Overview
This document provides a comprehensive solution for debugging and resolving 403 Forbidden errors when creating profiles in the Quickwork web application.

## Problem Description
Users were encountering 403 Forbidden errors when attempting to create or update their profiles:
```
ProfileAPI: 403 Forbidden - Authentication issue
ProfileAPI: Make sure user is logged in and cookies are set
ProfileAPI: Request failed: HTTP error! status: 403
```

## Root Cause Analysis
The 403 errors typically occur due to:
1. **Missing Authentication**: User is not properly logged in
2. **Cookie Issues**: Authentication cookies are not being sent or recognized
3. **Token Problems**: Auth tokens are missing or expired
4. **Backend Authentication**: Backend is not recognizing the authentication

## Solution Implementation

### 1. Enhanced Authentication Checking
Added comprehensive authentication validation in `JobSeekerProfile.tsx`:

```typescript
// Import authentication hook
import { useAuth } from '../../../hooks/useAuth';

// Check authentication status
const { isAuthenticated } = useAuth();

// Pre-submission authentication check
if (!isAuthenticated) {
  console.error('User not authenticated, redirecting to login');
  toast.error('You must be logged in to create a profile. Redirecting to login...');
  setTimeout(() => navigate('/auth'), 2000);
  return;
}
```

### 2. Authentication Debug Utilities
Created `src/utils/authDebug.ts` with comprehensive debugging tools:

```typescript
export const debugAuthState = () => {
  // Logs detailed authentication state information
};

export const checkCookieCompatibility = () => {
  // Checks cookie compatibility and security context
};

export const testApiConnection = async () => {
  // Tests basic API connectivity using existing endpoints
  // Tries both base API URL and the auth/check-email endpoint
  // Provides detailed diagnostics about connection issues
};

export const runFullAuthDiagnostic = async () => {
  // Runs complete authentication diagnostic
};
```

### 3. Enhanced Profile API Error Handling
Improved `profileApi.ts` with better authentication checking:

```typescript
const checkAuthStatus = (): boolean => {
  const hasToken = !!localStorage.getItem('authToken');
  const hasCookies = document.cookie.includes('session') || 
                     document.cookie.includes('auth') || 
                     document.cookie.includes('token');
  
  console.log('ProfileAPI: Auth check:', {
    hasToken,
    hasCookies,
    cookies: document.cookie,
    localStorage: localStorage.getItem('authToken')
  });
  
  return hasToken || hasCookies;
};
```

### 4. User-Friendly Error Messages
Enhanced error handling with specific user guidance:

```typescript
if (error.message.includes('403') || error.message.includes('Authentication')) {
  toast.error('Authentication failed. Please login again and try creating your profile.');
  setTimeout(() => navigate('/auth'), 2000);
}
```

### 5. Authentication Guard UI
Added authentication warning screen that appears when user is not authenticated:

```typescript
if (!isAuthenticated) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
        {/* Authentication required message with login button */}
        {/* Debug button for troubleshooting */}
      </div>
    </div>
  );
}
```

## Debugging Features

### 1. Authentication Status Logging
The component now logs detailed authentication information:
- Token presence and value (masked)
- Cookie contents
- Authentication context state
- User ID information

### 2. Debug Buttons in UI
- **Authentication Warning Screen**: "Debug Authentication" button
- **Error Display**: Debug link when 403 errors occur
- Both buttons run `runFullAuthDiagnostic()` and log results to console

### 3. Enhanced API Logging
The ProfileAPI now provides detailed logging:
- Request configuration
- Response status and headers
- Authentication state before requests
- Detailed error information

## Troubleshooting Steps

### For Users:
1. **Check Login Status**: Ensure you're logged in to the application
2. **Clear Browser Data**: Clear cookies and local storage, then login again
3. **Use Debug Button**: Click the debug button and check browser console
4. **Try Different Browser**: Test in incognito mode or different browser

### For Developers:
1. **Check Console Logs**: Look for detailed authentication debug information
2. **Verify API Configuration**: Ensure VITE_API_URL is correctly set
3. **Check Backend Logs**: Verify backend is receiving and processing auth correctly
4. **Test API Endpoints**: Use the built-in API connection test

## Configuration Requirements

### Environment Variables:
```env
VITE_API_URL=http://localhost:1010/api  # Backend API URL
```

### API Client Configuration:
```typescript
// services/api.tsx
export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // CRITICAL: Enables cookie-based authentication
})
```

### Backend Requirements:
- CORS configured to allow credentials
- Cookie-based authentication properly implemented
- Profile endpoints secured and requiring authentication

## Testing Verification

### Test Cases:
1. **Authenticated User**: Should be able to create/update profile successfully
2. **Unauthenticated User**: Should see authentication warning screen
3. **Authentication Failure**: Should see helpful error messages and debug options
4. **API Connection Issues**: Should provide clear feedback about connectivity problems

### Debug Information Available:
- Authentication token status
- Cookie contents and compatibility
- API connectivity test results
- Request/response details
- Error context and suggestions

## Error Prevention

### Best Practices:
1. **Always Check Authentication**: Verify user is authenticated before profile operations
2. **Provide Clear Feedback**: Show helpful error messages with next steps
3. **Enable Debugging**: Provide debug tools for troubleshooting
4. **Graceful Degradation**: Handle authentication failures gracefully
5. **User Guidance**: Guide users to login when authentication is required

## Files Modified:
- `src/features/profile/components/JobSeekerProfile.tsx` - Enhanced with auth checking and debugging
- `src/features/profile/api/profileApi.ts` - Enhanced authentication validation
- `src/utils/authDebug.ts` - New comprehensive debugging utilities
- `src/context/AuthContext.tsx` - Authentication context (existing)
- `src/services/auth.tsx` - Authentication API (existing)
- `src/services/api.tsx` - API client configuration (existing)

## Next Steps:
1. Monitor authentication issues in production
2. Collect user feedback on error messages and debugging tools
3. Consider adding automated authentication refresh
4. Implement session timeout handling
5. Add authentication status indicators in UI
