# Backend Logout API Alignment

This document describes the alignment of the frontend logout functionality with the backend logout endpoint.

## Backend Logout API

The backend provides a logout endpoint that properly clears authentication cookies:

```java
@PostMapping("/logout")
public ResponseEntity<?> logout(HttpServletResponse response) {
    Cookie cookie = new Cookie("refreshToken", null);
    cookie.setHttpOnly(true);
    cookie.setSecure(true);
    cookie.setPath("/");
    cookie.setMaxAge(0); // Clear cookie by setting maxAge to 0
    response.addCookie(cookie);
    return ResponseEntity.ok().build();
}
```

## Frontend Updates

### 1. Auth Service Endpoint Update (`src/services/auth.tsx`)

**Before:**
```tsx
logout: () => api.post('/auth/logout')
```

**After:**
```tsx
logout: () => api.post('/logout') // Updated to match backend endpoint
```

### 2. Enhanced Error Handling & Navigation (`src/context/AuthContext.tsx`)

**Before:**
```tsx
const logout = async () => {
  await authAPI.logout();
  setUser(null);
  setIsAuthenticated(false);
};
```

**After:**
```tsx
const logout = async () => {
  try {
    await authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
    // Navigate to BeforeAuth page after successful logout
    navigate('/auth');
  } catch (error) {
    // Even if logout API fails, clear local state
    // The cookie might have been cleared by the backend
    console.warn('Logout API call failed, but clearing local state:', error);
    setUser(null);
    setIsAuthenticated(false);
    // Still navigate to BeforeAuth page even on error
    navigate('/auth');
    // Re-throw the error so UI can handle it appropriately
    throw error;
  }
};
```

## API Configuration

The API is correctly configured to handle cookies:

```tsx
export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Important for browser to send/receive cookies
})
```

## Logout Flow

1. **User clicks logout button** → Frontend calls `logout()` from AuthContext
2. **AuthContext calls authAPI.logout()** → Makes POST request to `/logout`
3. **Backend processes logout** → Clears `refreshToken` cookie by setting `maxAge: 0`
4. **Backend returns 200 OK** → Indicates successful logout
5. **Frontend clears state** → Sets `user: null` and `isAuthenticated: false`
6. **Automatic navigation** → AuthContext navigates to `/auth` (BeforeAuth page)
7. **BeforeAuth page loads** → User sees login/register options

## Cookie Management

### Backend Cookie Settings
- **Name**: `refreshToken`
- **HttpOnly**: `true` (prevents JavaScript access)
- **Secure**: `true` (only sent over HTTPS)
- **Path**: `/` (available for all routes)
- **MaxAge**: `0` (immediately expires the cookie)

### Frontend Cookie Handling
- **Automatic**: Browser handles cookie sending/receiving automatically
- **Credentials**: `withCredentials: true` ensures cookies are included in requests
- **No Manual Management**: Frontend doesn't directly manipulate cookies

## Error Handling Strategy

### Robust Logout
Even if the logout API call fails (network error, server error), the frontend still:
1. Clears local authentication state
2. Logs a warning message
3. Navigates to BeforeAuth page (`/auth`)
4. Re-throws the error for UI handling
5. Allows user to proceed with logout flow

### Rationale
- **User Experience**: User isn't stuck in authenticated state due to network issues
- **Security**: Local state is cleared regardless of API response
- **Navigation**: Consistent redirect to BeforeAuth page in all scenarios
- **Debugging**: Errors are logged for troubleshooting
- **UI Feedback**: Error is available for toast notifications

## Toast Notifications

The logout buttons implement comprehensive feedback:

```tsx
const handleLogout = useCallback(async () => {
  try {
    toast.loading('Logging out...', { id: 'logout' });
    await logout();
    toast.success('Logged out successfully!', { id: 'logout' });
  } catch (error: any) {
    console.error('Logout error:', error);
    toast.error('Failed to logout. Please try again.', { id: 'logout' });
  }
}, [logout]);
```

## Security Considerations

### Cookie Security
- **HttpOnly**: Prevents XSS attacks from accessing cookies
- **Secure**: Ensures cookies only sent over HTTPS in production
- **Path**: Limits cookie scope to necessary paths
- **MaxAge**: Properly expires cookies on logout

### State Management
- **Immediate Clearing**: Local state cleared even on API failure
- **No Persistence**: No sensitive data stored in localStorage
- **Session Based**: Relies on secure server-side session management

## Testing

### Successful Logout
1. User clicks logout button
2. Loading toast appears
3. API call succeeds (200 OK)
4. Success toast appears
5. User automatically redirected to BeforeAuth page (`/auth`)
6. Cookie cleared from browser
7. User sees login/register options

### Failed Logout (Network Error)
1. User clicks logout button
2. Loading toast appears
3. API call fails (network/server error)
4. Error toast appears
5. User still redirected to BeforeAuth page (local state cleared)
6. Cookie may or may not be cleared (depending on when error occurred)
7. User can retry login or register

## Build Status

✅ **Endpoint Updated**: Frontend now calls correct `/logout` endpoint  
✅ **Error Handling**: Robust error handling implemented  
✅ **TypeScript**: All types compile correctly  
✅ **Build Success**: Production build completes successfully  
✅ **Cookie Support**: API configured with `withCredentials: true`  

## Related Files

- `src/services/auth.tsx` - Auth API service (endpoint updated)
- `src/context/AuthContext.tsx` - Authentication context (error handling enhanced)
- `src/services/api.tsx` - Base API configuration (cookie support confirmed)
- All profile/dashboard components - Logout button implementations
