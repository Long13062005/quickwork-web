/**
 * COMPLETE PROFILE FLOW DOCUMENTATION
 * Role Selection → State Management → Profile Completion → API Submission
 * 
 * This document outlines the complete flow from role selection to API submission
 * with detailed state management and API integration.
 */

## 🔄 UPDATED FLOW SEQUENCE

### 1. **CHOOSE ROLE** (`/pages/ChooseRole.tsx`)
```typescript
// User selects Job Seeker or Employer
const handleRoleSelection = async (role: 'job-seeker' | 'employer') => {
  // 1. Create LOCAL profile with role (NO API CALL)
  const result = await dispatch(createLocalProfile({ 
    role: actualRole, 
    profileData: basicProfileData 
  }));
  
  // 2. Store profile in LOCAL Redux state only
  if (createLocalProfile.fulfilled.match(result)) {
    // 3. Navigate to profile page to complete ALL data
    navigate(`/profile/${role}`);
  }
}
```

### 2. **COMPLETE ALL PROFILE DATA** 
- User fills out ALL profile information in local state
- Skills, experience, education, company details, etc.
- Real-time completion tracking (must be 70%+)
- NO API calls during this phase

### 3. **API SUBMISSION** (Only when Submit button clicked)
```typescript
const submitProfile = async (profile: Profile) => {
  // 1. Validate completion (70%+)
  if (!canSubmit(profile)) return;
  
  // 2. FIRST API CALL: Create complete profile
  const createResult = await dispatch(createProfile({
    role: profile.role,
    profileData: completeProfileData // ALL data included
  }));
  
  if (success) {
    // 3. SECOND API CALL: Submit for final processing
    const submitResult = await dispatch(submitCompleteProfile(profileId));
    
    if (success) {
      // 4. Show success with API output
      navigate('/profile/success');
    } else {
      // 5. Delete state, redirect to role selection
      navigate('/choose-role');
    }
  }
}
```

## 🎯 KEY CHANGE: NO API UNTIL COMPLETE

### ✅ **Before (OLD)**
- Choose Role → **API call** → Profile editing

### ✅ **Now (NEW)**  
- Choose Role → **Local state** → Complete ALL data → **API calls**

This ensures the API only receives complete, validated profile data! 🎉

### 1. **CHOOSE ROLE** (`/pages/ChooseRole.tsx`)
```typescript
// User selects Job Seeker or Employer
const handleRoleSelection = async (role: 'job-seeker' | 'employer') => {
  // 1. Create basic profile with role
  const result = await dispatch(createProfile({ 
    role: actualRole, 
    profileData: basicProfileData 
  }));
  
  // 2. Store profile in Redux state
  if (createProfile.fulfilled.match(result)) {
    // 3. Navigate to profile page
    navigate(`/profile/${role}`);
  }
}
```

### 2. **REDUX STATE MANAGEMENT** (`/features/profile/ProfileSlice.ts`)
```typescript
// Profile is stored in Redux state
const ProfileState = {
  currentProfile: Profile | null,     // ← Role and basic data stored here
  isLoading: boolean,
  isUpdating: boolean,
  error: string | null,
  // ... other state properties
}

// Actions available:
// - createProfile: Creates initial profile with role
// - updateProfile: Updates profile data
// - submitCompleteProfile: Final API submission
// - deleteProfile: Cleans up on failure
```

### 3. **PROFILE COMPLETION** (`/features/profile/components/JobSeekerProfile.tsx` | `EmployerProfile.tsx`)
```typescript
// User fills out profile information
const JobSeekerProfile = () => {
  const { profile } = useProfile();                    // ← Gets from Redux state
  const { submitProfile, canSubmit } = useProfileSubmission();
  
  // Profile completion calculated in real-time
  const completionPercentage = calculateProfileCompletion(profile);
  
  // Submit button appears when profile is 70%+ complete
  const showSubmitButton = canSubmit(profile); // true if >= 70%
}
```

### 4. **API SUBMISSION** (`/hooks/useProfileSubmission.ts`)
```typescript
const submitProfile = async (profile: Profile) => {
  // 1. Validate profile completion (minimum 70%)
  if (!canSubmit(profile)) return;
  
  // 2. Transform to API format
  const apiData = transformToApi(profile);
  
  // 3. Submit to API
  const result = await dispatch(submitCompleteProfile(profile.id));
  
  if (success) {
    // 4. Navigate to success page with API output
    navigate('/profile/success', { state: { submittedData: apiData } });
  } else {
    // 5. Delete profile state and redirect to role selection
    dispatch(deleteProfile(profile.id));
    navigate('/choose-role', { state: { error: 'Submission failed' } });
  }
}
```

### 5. **API TRANSFORMATION** (`/utils/profileApiUtils.ts`)
```typescript
// Profile data transformed to exact API format
JobSeeker → {
  "userId": 1,
  "profileType": "JOB_SEEKER",
  "fullName": "Alice Johnson",
  "phone": "+1234567890",
  "address": "123 Main St, Cityville",
  "summary": "Experienced software developer...",
  "skills": ["Java", "Spring Boot", "SQL"],
  "experiences": ["3 years at TechCorp", "2 years at DevSolutions"],
  "companyName": null,
  "companyWebsite": null
}

Employer → {
  "userId": 2,
  "profileType": "EMPLOYER",
  "fullName": "Bob Smith",
  "phone": "+1987654321",
  "address": "456 Business Rd, Metropolis",
  "summary": "HR manager at TechEnterprises...",
  "skills": null,
  "experiences": null,
  "companyName": "TechEnterprises",
  "companyWebsite": "https://techenterprises.com"
}
```

## 🎯 STATE FLOW DIAGRAM

```
┌─────────────────┐
│   Choose Role   │ ──────┐
└─────────────────┘       │
                          ▼
┌─────────────────────────────────────┐
│        Redux Store                  │
│  currentProfile: {                  │
│    id: "123",                       │
│    role: "job_seeker",             │
│    firstName: "John",               │
│    lastName: "Doe",                 │
│    email: "john@example.com",       │
│    // ... other fields              │
│  }                                  │
└─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────┐
│     Profile Component               │
│  - Shows current profile data      │
│  - Calculates completion %          │
│  - Shows Submit button when ready  │
│  - Handles form updates             │
└─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────┐
│    Profile Submission               │
│  - Validates completion (70%+)      │
│  - Transforms to API format         │
│  - Calls API endpoint               │
│  - Handles success/failure          │
└─────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                ▼                   ▼
    ┌─────────────────┐   ┌─────────────────┐
    │    SUCCESS      │   │     FAILURE     │
    │  - Show API     │   │  - Delete state │
    │    output       │   │  - Redirect to  │
    │  - Download     │   │    role select  │
    │    option       │   │  - Show error   │
    └─────────────────┘   └─────────────────┘
```

## 🚀 KEY FEATURES

### ✅ **State Management**
- Role selected and stored in Redux
- Profile data persisted across navigation
- Real-time updates and validation
- Automatic cleanup on failure

### ✅ **UI/UX Features**
- Submit button only shows when profile is 70%+ complete
- Real-time completion progress indicator
- Loading states during API calls
- Success page with API output display
- Export functionality for testing

### ✅ **Error Handling**
- Automatic profile state deletion on API failure
- User redirected back to role selection
- Clear error messages and feedback
- Graceful fallback handling

### ✅ **API Integration**
- POST `/api/profile` - Create initial profile
- PATCH `/api/profile/{id}` - Update profile data
- POST `/api/profile/{id}/submit` - Final submission
- DELETE `/api/profile/{id}` - Cleanup on failure

## 🧪 TESTING THE FLOW

1. **Start the app**: `npm run dev`
2. **Navigate to**: `http://localhost:5173/choose-role`
3. **Select a role**: Job Seeker or Employer
4. **Fill out profile**: Complete at least 70% of fields
5. **Submit profile**: Click "Submit Profile" button
6. **View API output**: See the exact JSON format on success page
7. **Download/Copy**: Export the JSON for testing

The complete flow ensures robust state management, proper API integration, and graceful error handling with automatic cleanup! 🎉
