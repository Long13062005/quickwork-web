# Logout and Auth Redirect Implementation

## Summary
This document outlines the implementation of a consistent logout flow that redirects users to the `/auth` page after logout, regardless of their role or the success/failure of the logout operation.

## Implementation Details

### 1. Dashboard Components
Each dashboard component (UserDashboard, EmployerDashboard, AdminDashboard) now has an updated `handleLogout` function that:
- Shows a loading toast with the message "Logging out..."
- Sets a timeout to dismiss the loading toast after 3 seconds if the logout operation takes too long
- Calls the `logout()` function from AuthContext
- Clears the timeout if logout completes successfully
- Dismisses the loading toast immediately after successful logout
- Redirects to the `/auth` page after successful logout
- Shows an error toast if logout fails
- Redirects to the `/auth` page even if logout fails

### 2. AuthContext Implementation
The AuthContext logout function:
- Attempts to call the backend logout endpoint via authAPI.logout()
- Uses a race between the logout request and a timeout to ensure we don't wait forever
- Clears local authentication state regardless of API success/failure
- Always navigates to the `/auth` page after a small delay (to ensure UI updates complete)

### 3. Auth API Implementation
The authAPI.logout function:
- Calls the backend logout endpoint at `/auth/logout` with credentials to ensure cookies are sent
- The backend receives the refreshToken cookie, invalidates it in the database, and clears the cookie
- If the backend call fails, manually clears auth cookies as a fallback

## Security Benefits
- Ensures users are always redirected to the login page after logout
- Prevents users from accessing protected pages after logout
- Handles both successful and failed logout scenarios gracefully
- Provides visual feedback during the logout process
- Ensures token invalidation on the backend for proper security

## Edge Case Handling
- If the backend is unresponsive, the logout operation will timeout after 5 seconds but still redirect to the auth page
- If the logout API call fails, cookies are manually cleared as a fallback
- Loading toasts are dismissed after 3 seconds to ensure they don't stay indefinitely if navigation issues occur

## Tested Scenarios
- Successful logout with backend token invalidation
- Logout with backend API failure
- Logout with network connectivity issues

This implementation ensures a consistent and secure logout experience for all users regardless of their role or the success/failure of the backend operation.
