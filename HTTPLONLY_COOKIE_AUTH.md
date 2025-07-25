# HTTPOnly Cookie Authentication Configuration

## Overview
The Quickwork web application has been updated to properly support HTTPOnly cookie authentication, which is the most secure method for handling user sessions.

## What are HTTPOnly Cookies?
HTTPOnly cookies are:
- **Secure**: Cannot be accessed by JavaScript, preventing XSS attacks
- **Automatic**: Sent automatically by the browser with every request
- **Backend-managed**: Created, validated, and invalidated only by the server
- **Best Practice**: Industry standard for authentication cookies

## Changes Made

### 1. ProfileAPI Configuration
**File: `src/features/profile/api/profileApi.ts`**

```typescript
const config: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
    ...options.headers,
  },
  credentials: 'include', // CRITICAL: Include HTTPOnly cookies for authentication
  ...options,
};
```

**Key Changes:**
- ✅ `credentials: 'include'` ensures HTTPOnly cookies are sent with every request
- ✅ Removed client-side authentication checks (impossible with HTTPOnly cookies)
- ✅ Updated error logging to reflect HTTPOnly cookie authentication
- ✅ Let backend handle all authentication validation

### 2. Authentication Context Updates
**File: `src/context/AuthContext.tsx`**

```typescript
const [isAuthenticated, setIsAuthenticated] = useState(true); // Start optimistic
```

**Key Changes:**
- ✅ Removed localStorage token checking (not needed with HTTPOnly cookies)
- ✅ Start with optimistic authentication state
- ✅ Authentication status determined by API responses, not client-side checks

### 3. Profile Component Simplification
**File: `src/features/profile/components/JobSeekerProfile.tsx`**

**Key Changes:**
- ✅ Removed authentication guard screen (unnecessary with HTTPOnly cookies)
- ✅ Removed pre-flight authentication checks
- ✅ Let API handle authentication validation
- ✅ Simplified error handling for 403 responses

## How HTTPOnly Authentication Works

### 1. Login Process
```
User Login → Backend validates → Sets HTTPOnly cookie → Cookie sent automatically
```

### 2. API Requests
```
Frontend Request → Browser includes HTTPOnly cookie → Backend validates → Response
```

### 3. Authentication Validation
```
No client-side checks → Backend validates cookie → Returns 200 (success) or 403 (unauthorized)
```

## Error Handling

### 403 Forbidden Responses
When the backend returns 403, it means:
- User session has expired
- User is not logged in
- Backend authentication service issue
- CORS configuration problem

### User Experience
- Users see friendly error messages: "Authentication failed. Please login again."
- Automatic redirect to login page on authentication failures
- No confusing client-side authentication checks

## Backend Requirements

### CORS Configuration
Your backend must allow credentials:
```java
// Spring Boot example
@CrossOrigin(origins = "http://localhost:5174", allowCredentials = true)
```

### Cookie Configuration
HTTPOnly cookies should be configured with:
- `HttpOnly: true` (prevents JavaScript access)
- `Secure: true` (HTTPS only, if in production)
- `SameSite: Lax` or `Strict` (CSRF protection)
- Appropriate `Path` and `Domain`

### Authentication Endpoints
- `POST /auth/login` - Creates HTTPOnly cookie
- `POST /auth/logout` - Clears HTTPOnly cookie
- `GET /auth/check-email` - For email validation (public)

## Testing & Verification

### 1. Browser DevTools
- Check Network tab for `Set-Cookie` headers on login
- Verify `Cookie` headers are sent with API requests
- Cannot see HTTPOnly cookies in Application > Cookies (this is correct!)

### 2. Authentication Flow
1. User logs in successfully
2. Backend sets HTTPOnly cookie
3. User navigates to profile page
4. Profile API requests include cookie automatically
5. Backend validates and returns profile data

### 3. Session Expiry
1. Session expires on backend
2. Profile API returns 403
3. User sees "authentication failed" message
4. User redirected to login page

## Security Benefits

### With HTTPOnly Cookies:
✅ **XSS Protection**: JavaScript cannot access auth cookies
✅ **Automatic Inclusion**: Browser handles cookie sending
✅ **Server-side Control**: Backend manages all authentication
✅ **CSRF Protection**: With SameSite attribute
✅ **No Token Exposure**: No auth tokens in localStorage/sessionStorage

### Previous Issues Resolved:
❌ Client-side auth guessing
❌ False authentication failures
❌ Insecure token storage
❌ Manual cookie management

## Troubleshooting

### Common Issues:
1. **CORS**: Ensure `allowCredentials: true` in backend
2. **Domain Mismatch**: Cookie domain must match request domain
3. **HTTPS**: Use secure cookies in production
4. **Path**: Ensure cookie path covers API endpoints

### Debug Steps:
1. Check Network tab for Set-Cookie on login
2. Verify Cookie header in API requests
3. Check backend logs for authentication validation
4. Test with different browsers/incognito mode

## Production Considerations

### Security:
- Use `Secure: true` for HTTPS
- Set appropriate `SameSite` policy
- Configure proper cookie domain
- Use HTTPS everywhere

### Performance:
- HTTPOnly cookies are sent with every request to domain
- Keep cookie size minimal
- Use efficient session storage on backend

The application now properly handles HTTPOnly cookie authentication, providing both security and simplicity!
