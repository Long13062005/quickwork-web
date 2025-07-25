# Backend API Alignment - Authentication & Profile Management

## Updated Frontend to Match Backend Controller Structure

Your backend `ProfileController` returns data in a different format than the frontend was expecting. Here are the key changes made:

### Backend API Structure (ProfileController)
```java
@GetMapping("/me")
public ResponseEntity<ProfileEntity> getMyProfile()
// Returns ProfileEntity directly (not wrapped in data field)

@PostMapping
public ResponseEntity<ProfileEntity> createOrUpdateProfile(@Valid @RequestBody ProfileRequest request)
// Returns ProfileEntity directly

@PatchMapping("/{userId}")  
public ResponseEntity<ProfileEntity> updateProfile(@PathVariable Long userId, @Valid @RequestBody ProfileRequest request)
// Returns ProfileEntity directly
```

### Frontend Changes Made

#### 1. **AuthSlice.tsx** - Fixed authentication check
```typescript
// Updated checkAuthStatus to handle ProfileEntity response
export const checkAuthStatus = createAsyncThunk<UserProfile, void, { rejectValue: string }>
('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
  try {
    const res = await authAPI.getProfile();
    // Backend returns ProfileEntity directly, not wrapped in data field
    return res.data || res;
  } catch (err: any) {
    // Handle 401/403 properly
    if (err.response?.status === 401 || err.response?.status === 403) {
      return rejectWithValue('Not authenticated');
    }
    return rejectWithValue(err.response?.data?.message || 'Auth check failed');
  }
});

// Updated fetchProfile similarly
export const fetchProfile = createAsyncThunk<UserProfile>('auth/fetchProfile', async () => {
  const res = await authAPI.getProfile();
  return res.data || res;
});
```

#### 2. **auth.tsx** - Updated API endpoint and UserProfile interface
```typescript
// Fixed endpoint to match backend
export const authAPI = {
  // ... other methods
  getProfile: () => api.get<UserProfile>('/profile/me'), // Changed from /auth/me
};

// Updated UserProfile to match backend ProfileEntity structure
export interface UserProfile { 
  id: number; 
  userId: number;
  email?: string; 
  fullName: string;
  phone?: string;
  address?: string;
  summary?: string;
  profileType: 'JOB_SEEKER' | 'EMPLOYER';
  skills?: string[];
  experiences?: string[];
  companyName?: string;
  companyWebsite?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

#### 3. **profileApi.ts** - Updated response handling
```typescript
// Updated handleResponse to work with backend's direct ProfileEntity response
private async handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  // Backend returns ProfileEntity directly (not wrapped in data field)
  // Check if this is a profile response and transform it
  if (data && (data.profileType || data.fullName !== undefined)) {
    const transformedProfile = this.transformBackendProfileToFrontend(data);
    // Wrap in expected frontend response format
    return { data: transformedProfile } as T;
  }
  
  return data;
}
```

### Key Backend Compatibility Features

1. **Direct ProfileEntity Response**: Backend returns `ProfileEntity` directly, not wrapped in `{data: ...}`
2. **Correct Endpoints**: 
   - GET `/api/profile/me` for current user profile
   - POST `/api/profile` for create/update
   - PATCH `/api/profile/{userId}` for updates
3. **Authentication**: Uses Spring Security with cookies
4. **Validation**: Uses `@Valid` for request validation

### Authentication Flow Now Works As:

1. **Page Load**: `AppInitializer` runs `checkAuthStatus()`
2. **API Call**: `GET /api/profile/me` with cookies
3. **Backend Check**: Spring Security validates session/JWT
4. **Response**: Returns `ProfileEntity` directly if authenticated
5. **Frontend**: Transforms `ProfileEntity` to frontend format
6. **Routing**: `SmartRedirect` sends user to appropriate page

### Error Handling

- **401/403 Responses**: Properly handled as "not authenticated"
- **404 Responses**: Triggers auto-profile creation (if enabled)
- **Other Errors**: Proper error messages displayed

### Testing the Fix

1. Log in to your app
2. Navigate to any protected page
3. Reload the browser
4. Should stay on the same page instead of redirecting to login
5. Cookies are validated automatically via the backend

The frontend now correctly matches your Spring Boot backend API structure!
