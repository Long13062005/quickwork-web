# Unified Profile API Implementation

## Overview

The Quickwork web application now uses a **unified POST endpoint** for both profile creation and updates, matching the backend's `createOrUpdateProfile` method. This ensures full compatibility between the frontend and backend profile management systems.

## Backend Integration

### Unified Endpoint
- **Endpoint**: `POST /api/profile`
- **Backend Method**: `createOrUpdateProfile`
- **Logic**: The backend automatically determines whether to create a new profile or update an existing one based on the authenticated user's current profile state.

### Data Structure
The frontend transforms its profile data to match the backend's `ProfileRequest` structure:

```typescript
// Frontend → Backend Transformation
{
  userId: null, // Set by backend from authenticated user
  fullName: firstName + " " + lastName,
  phone: phone,
  address: location.city + ", " + location.state + ", " + location.country,
  summary: bio,
  avatarUrl: avatarUrl,
  skills: Array<string>, // Always an array for job seekers
  experiences: Array<string>, // Always an array for job seekers
  profileType: "JOB_SEEKER" | "EMPLOYER",
  companyName: string, // For employers
  companyWebsite: string // For employers
}
```

## Frontend Implementation

### API Service (`profileApi.ts`)
- **createProfile**: Uses `POST /api/profile`
- **updateProfile**: Uses `POST /api/profile` (same unified endpoint)
- Both methods transform frontend data structure to backend-compatible format
- Arrays (skills, experiences) are always initialized to ensure proper structure

### Redux Integration (`ProfileSlice.ts`)
- `updateProfile` thunk calls API without userId parameter
- All profile save/update operations go through the unified POST flow

### React Hooks (`useProfile.ts`)
- `saveProfile` method intelligently determines create vs update based on profile existence
- Both operations use the same backend endpoint
- Proper error handling and state management

### Form Components
- `JobSeekerProfile.tsx` and `EmployerProfile.tsx` both use the unified `saveProfile` method
- Data transformation handled automatically by the API service
- Consistent user experience regardless of profile state

## Key Features

### Automatic Profile Creation
- When a user first accesses their profile, a basic profile is automatically created if none exists
- This eliminates the need for separate create/update logic in the UI

### Data Transformation
- Frontend form data is automatically transformed to backend-compatible structure
- Field mappings:
  - `firstName + lastName` → `fullName`
  - `bio` → `summary`
  - `location` object → `address` string
  - `skills` array → properly structured for backend
  - `experience` objects → `experiences` strings array

### Error Handling
- Unified error handling for both create and update operations
- Proper fallback to profile creation when no profile exists
- User-friendly error messages

### Type Safety
- Full TypeScript support with proper type definitions
- Backend-compatible types ensure data integrity
- Compile-time validation prevents runtime errors

## Testing

### Build Verification
- All changes have been verified with successful builds
- No breaking changes to existing functionality
- Full type safety maintained

### API Compatibility
- Frontend data structure matches backend expectations
- Proper array initialization for required fields
- Correct enum mapping (JOB_SEEKER/EMPLOYER)

## Security

### Cookie-Based Authentication
- All requests use secure HTTP-only cookies
- `credentials: 'include'` ensures proper authentication
- No localStorage token usage for enhanced security

### Data Validation
- Frontend validation before API calls
- Backend validation as final security layer
- Proper error handling for validation failures

## Benefits

1. **Simplified Logic**: Single endpoint for both create and update
2. **Backend Compatibility**: Perfect alignment with backend implementation
3. **Reduced Complexity**: No need to determine create vs update in frontend
4. **Better UX**: Seamless profile management regardless of profile state
5. **Maintainability**: Single code path for all profile operations
6. **Type Safety**: Full TypeScript support with proper type definitions

## Future Considerations

- Monitor API performance with unified endpoint
- Consider adding optimistic updates for better UX
- Potential for real-time profile validation
- Enhanced error reporting and user feedback
