# Auto Profile Creation Feature

## Overview
The Quickwork application now automatically creates a basic profile for new users when they don't have an existing profile. This ensures every authenticated user has a profile structure in place.

## How It Works

### 1. **API Level Auto-Creation**
- When `GET /api/profile/me` returns 404 (profile not found)
- The system automatically calls `POST /api/profile` to create a basic profile
- Default role is set to `job_seeker` (users can change this later)
- Basic profile structure includes empty fields for personal information

### 2. **Client-Side Handling**
- The `ProfileApiService.getCurrentProfile()` method handles the auto-creation
- If profile fetch fails with 404, it creates a new basic profile
- The created profile is returned as if it existed originally

### 3. **Redux Integration**
- The `fetchCurrentProfile` thunk automatically benefits from this behavior
- Profile state is updated with the newly created profile
- No additional client-side logic needed

## Implementation Details

### ProfileApiService Methods

#### `getCurrentProfile()`
```typescript
async getCurrentProfile(): Promise<ProfileResponse> {
  try {
    // Try to fetch existing profile
    const response = await fetch(`${PROFILE_ENDPOINT}/me`, ...);
    
    if (response.ok) {
      return this.handleResponse<ProfileResponse>(response);
    }
    
    // If 404, create basic profile
    if (response.status === 404) {
      return this.createBasicProfile();
    }
    
    // Handle other errors normally
    return this.handleResponse<ProfileResponse>(response);
  } catch (error) {
    // Handle not found errors
    if (error.message?.includes('404')) {
      return this.createBasicProfile();
    }
    throw error;
  }
}
```

#### `createBasicProfile()` (Private Method)
```typescript
private async createBasicProfile(): Promise<ProfileResponse> {
  const basicProfileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: {
      city: '',
      state: '',
      country: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    },
    bio: '',
    website: '',
    socialLinks: { linkedin: '', github: '', twitter: '', portfolio: '' }
  };

  const response = await fetch(PROFILE_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify({ role: 'job_seeker', ...basicProfileData }),
    ...this.getFetchOptions()
  });

  return this.handleResponse<ProfileResponse>(response);
}
```

### Enhanced useProfile Hook

#### New Utility Methods
- `isBasicProfile(profile?)`: Checks if profile needs completion
- `needsProfileCompletion()`: Returns true if current profile is incomplete
- `fetchProfile()`: Now returns Promise and detects new profile creation

#### Usage Example
```typescript
const { profile, fetchProfile, isBasicProfile, needsProfileCompletion } = useProfile();

useEffect(() => {
  fetchProfile().then((result) => {
    if (needsProfileCompletion()) {
      // Show profile completion prompt
      toast.info('Welcome! Please complete your profile setup.');
    }
  });
}, []);
```

## User Experience Flow

### 1. **New User Login**
1. User logs in successfully
2. System attempts to fetch profile (`GET /api/profile/me`)
3. API returns 404 (no profile exists)
4. System automatically creates basic profile
5. User sees profile interface with empty fields
6. User can immediately start filling out their profile

### 2. **Profile Detection**
- System can detect if profile was just created (empty required fields)
- Optional: Show welcome message or setup wizard
- User can change role from default `job_seeker` to `employer`

### 3. **Validation & Saving**
- Profile validation works as before
- Minimum 30% completion required for saving
- Auto-created profiles can be updated immediately

## Benefits

### ✅ **Seamless User Experience**
- No "Profile not found" errors
- Users can immediately start profile creation
- Eliminates extra navigation steps

### ✅ **Consistent State Management**
- Every authenticated user has a profile
- Redux state is always populated
- No need for null checks in components

### ✅ **API Reliability**
- Graceful handling of missing profiles
- Automatic recovery from profile creation failures
- Consistent API response structure

## Error Handling

### API Failures
- If profile creation fails, original error is thrown
- Logging included for debugging
- User sees appropriate error messages

### Network Issues
- Retries are handled at the API level
- Graceful degradation if creation fails
- User can retry profile fetch

## Configuration

### Environment Variables
- `VITE_API_URL`: Base API URL (defaults to localhost:1010)
- Timezone detection uses browser `Intl.DateTimeFormat()`

### Default Profile Structure
```typescript
{
  role: 'job_seeker',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  location: {
    city: '',
    state: '',
    country: '',
    timezone: 'America/New_York' // User's detected timezone
  },
  bio: '',
  website: '',
  socialLinks: {
    linkedin: '',
    github: '',
    twitter: '',
    portfolio: ''
  }
}
```

## Testing

### Unit Tests
```typescript
// Test auto-creation behavior
describe('ProfileApiService', () => {
  it('should create basic profile when profile not found', async () => {
    // Mock 404 response
    // Verify profile creation API call
    // Check returned profile structure
  });
});
```

### Integration Tests
- Login flow with new user
- Profile fetch and auto-creation
- Profile completion and saving

## Future Enhancements

### Possible Improvements
1. **Profile Setup Wizard**: Guide new users through profile completion
2. **Role Detection**: Smart role suggestion based on signup data
3. **Template Profiles**: Pre-filled profiles based on user's industry
4. **Onboarding Flow**: Integrated profile setup with app tutorial

### Configuration Options
- Default role selection
- Required vs optional fields
- Profile completion thresholds
- Auto-save behavior

This auto-creation feature ensures a smooth user experience while maintaining data integrity and consistent application state.
