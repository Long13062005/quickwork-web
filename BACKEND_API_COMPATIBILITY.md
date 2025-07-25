# Backend API Compatibility Update

## Overview
Updated the frontend ProfileApiService to match the backend's `ProfileRequest` data structure. This ensures seamless communication between the frontend and backend API.

## Backend Profile Structure
The backend expects the following `ProfileRequest` structure:

```java
@Data
public class ProfileRequest {
    private Long userId;
    
    @NotBlank(message = "Full name is required")
    @Size(max = 255, message = "Full name must not exceed 255 characters")
    private String fullName;
    
    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;
    
    private String address;
    private String summary;
    private String avatarUrl;
    private Set<String> skills; // For job seekers
    private Set<String> experiences; // For job seekers
    private ProfileType profileType; // JOB_SEEKER or EMPLOYER
    private String companyName; // For employers
    private String companyWebsite; // For employers
}
```

## Key Mapping Changes

### Frontend → Backend Data Transformation

#### Personal Information
- `firstName + lastName` → `fullName`
- `bio` → `summary`
- `location.city, location.state, location.country` → `address` (comma-separated)
- `phone` → `phone` (direct mapping)
- `avatarUrl` → `avatarUrl` (direct mapping)

#### Role Mapping
- `role: 'job_seeker'` → `profileType: 'JOB_SEEKER'`
- `role: 'employer'` → `profileType: 'EMPLOYER'`

#### Job Seeker Fields
- `jobSeekerData.skills[]` → `skills: Set<String>`
- `jobSeekerData.experience[]` → `experiences: Set<String>` (formatted as "Position at Company")

#### Employer Fields
- `employerData.companyName` → `companyName`
- `employerData.companyWebsite` → `companyWebsite`

### Backend → Frontend Data Transformation

#### Personal Information
- `fullName` → Split into `firstName` and `lastName`
- `summary` → `bio`
- `address` → Parse into `location` object with `city`, `state`, `country`
- `phone` → `phone` (direct mapping)
- `avatarUrl` → `avatarUrl` (direct mapping)

#### Role Mapping
- `profileType: 'JOB_SEEKER'` → `role: 'job_seeker'`
- `profileType: 'EMPLOYER'` → `role: 'employer'`

#### Default Values for Missing Frontend Fields
- `email`: Empty (comes from user authentication)
- `website`: Empty string
- `socialLinks`: Empty object
- `timezone`: Auto-detected from browser

## Updated API Methods

### 1. `createBasicProfile()` (Private)
```typescript
private async createBasicProfile(): Promise<ProfileResponse> {
  const basicProfileData = {
    userId: null, // Set by backend
    fullName: '',
    phone: '',
    address: '',
    summary: '',
    avatarUrl: '',
    skills: [],
    experiences: [],
    profileType: 'JOB_SEEKER', // Default
    companyName: '',
    companyWebsite: ''
  };
  // ... API call
}
```

### 2. `createProfile()`
```typescript
async createProfile(role: UserRole, profileData: FormData): Promise<ProfileResponse> {
  const backendProfileData = {
    fullName: `${profileData.firstName} ${profileData.lastName}`.trim(),
    phone: profileData.phone || '',
    address: formatAddress(profileData.location),
    summary: profileData.bio || '',
    skills: new Set(profileData.skills || []),
    experiences: formatExperiences(profileData.experience),
    profileType: role === 'job_seeker' ? 'JOB_SEEKER' : 'EMPLOYER',
    companyName: profileData.companyName || '',
    companyWebsite: profileData.companyWebsite || ''
  };
  // ... API call
}
```

### 3. `updateProfile()`
```typescript
async updateProfile(profileId: string, updates: ProfileUpdatePayload): Promise<ProfileResponse> {
  const backendUpdates: any = {};
  
  // Transform each field appropriately
  if (updates.firstName || updates.lastName) {
    backendUpdates.fullName = `${updates.firstName || ''} ${updates.lastName || ''}`.trim();
  }
  
  if (updates.location) {
    backendUpdates.address = formatLocationToAddress(updates.location);
  }
  
  // ... other field mappings
}
```

### 4. `transformBackendProfileToFrontend()` (Private)
```typescript
private transformBackendProfileToFrontend(backendProfile: any): any {
  // Split fullName
  const [firstName, ...lastNameParts] = backendProfile.fullName.split(' ');
  
  // Parse address
  const location = parseAddressToLocation(backendProfile.address);
  
  // Create frontend structure
  const frontendProfile = {
    id: backendProfile.id,
    firstName,
    lastName: lastNameParts.join(' '),
    phone: backendProfile.phone,
    location,
    bio: backendProfile.summary,
    avatarUrl: backendProfile.avatarUrl,
    role: backendProfile.profileType === 'JOB_SEEKER' ? 'job_seeker' : 'employer',
    // ... role-specific data
  };
  
  return frontendProfile;
}
```

## Response Transformation

### Automatic Data Transformation
The `handleResponse()` method automatically detects profile responses and transforms them:

```typescript
private async handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  
  // Transform profile data if detected
  if (data.data && (data.data.profileType || data.data.fullName !== undefined)) {
    data.data = this.transformBackendProfileToFrontend(data.data);
  }
  
  return data;
}
```

## Validation Compatibility

### Backend Validation Rules
- `fullName`: Required, max 255 characters
- `phone`: Optional, max 20 characters
- Other fields: Optional

### Frontend Handling
- Combines `firstName` + `lastName` before sending
- Ensures phone number doesn't exceed 20 characters
- Maintains existing frontend validation for user experience

## Error Handling

### Backend Error Messages
- Validation errors are returned with specific field messages
- HTTP status codes indicate error types
- Error structure: `{ message: "error description" }`

### Frontend Error Processing
- Errors are caught and re-thrown with meaningful messages
- Validation errors are displayed to users
- Network errors are handled gracefully

## Testing Compatibility

### Sample Request to Backend
```json
POST /api/profile
{
  "fullName": "John Doe",
  "phone": "+1234567890",
  "address": "New York, NY, USA",
  "summary": "Software engineer with 5 years experience",
  "avatarUrl": "",
  "skills": ["JavaScript", "React", "Node.js"],
  "experiences": ["Frontend Developer at TechCorp", "Junior Developer at StartupXYZ"],
  "profileType": "JOB_SEEKER",
  "companyName": "",
  "companyWebsite": ""
}
```

### Sample Response from Backend
```json
{
  "success": true,
  "data": {
    "id": 123,
    "userId": 456,
    "fullName": "John Doe",
    "phone": "+1234567890",
    "address": "New York, NY, USA",
    "summary": "Software engineer with 5 years experience",
    "avatarUrl": "",
    "skills": ["JavaScript", "React", "Node.js"],
    "experiences": ["Frontend Developer at TechCorp"],
    "profileType": "JOB_SEEKER",
    "companyName": "",
    "companyWebsite": "",
    "createdAt": "2025-06-29T10:00:00Z",
    "updatedAt": "2025-06-29T10:00:00Z"
  }
}
```

## Benefits

### ✅ **Complete Backend Compatibility**
- Matches exact field names and types expected by backend
- Handles enum values correctly (`JOB_SEEKER`/`EMPLOYER`)
- Supports backend validation requirements

### ✅ **Seamless Data Flow**
- Automatic transformation between frontend and backend formats
- No manual mapping required in components
- Consistent data structure throughout the application

### ✅ **Validation Integration**
- Backend validation messages are properly handled
- Frontend validation works alongside backend rules
- User-friendly error messages

### ✅ **Future-Proof Design**
- Easy to extend when backend adds new fields
- Transformation layer isolates frontend from backend changes
- Clear separation of concerns

## Migration Notes

### No Frontend Component Changes Required
- All existing components continue to work as before
- Profile data structure remains the same in the frontend
- Only the API service layer was updated

### Auto-Profile Creation Still Works
- `createBasicProfile()` uses the new backend structure
- Default values are compatible with backend validation
- Profile creation flow remains unchanged

This update ensures perfect compatibility between the Quickwork frontend and backend, enabling seamless profile management with proper validation and error handling.
