# Profile Module Deletion and Rebuild Plan

## Overview
The entire `src/features/profile/` module has been deleted and all references to it have been commented out or temporarily replaced. This creates a clean slate for rebuilding the profile system from scratch.

## What Was Deleted
- `src/features/profile/` directory and all its contents:
  - Components (JobSeekerProfile, EmployerProfile, ProfileForm, etc.)
  - Hooks (useProfile, useProfileUpdate, useProfileValidation, etc.)
  - Types (Profile, JobSeekerProfile, EmployerProfile, etc.)
  - Utils (profileCompletion, profileApiUtils, etc.)
  - Redux slice (ProfileSlice)
  - API layer (profileApi)

## What Was Updated/Fixed
- **Redux Store** (`src/store.tsx`): Removed profile reducer
- **Type Definitions** (`src/types/profile.types.ts`): Created minimal UserRole type
- **Route Handling** (`src/App.tsx`): Commented out profile routes, added temporary redirects
- **Authentication Flow** (`src/features/auth/LoginForm.tsx`): Commented out profile fetching
- **Navigation** (`src/components/SmartRedirect.tsx`): Simplified to redirect to role selection
- **Guards** (`src/components/AuthGuard.tsx`): Commented out profile completion checks
- **Role Selection** (`src/pages/ChooseRole.tsx`): Commented out profile creation logic
- **Dashboard Pages** (`src/pages/UserDashboard.tsx`, `src/pages/EmployerDashboard.tsx`): Removed profile dependencies
- **Avatar Upload** (`src/hooks/useAvatarUpload.ts`, `src/components/AvatarUpload.tsx`): Commented out profile updates
- **Profile Success** (`src/pages/ProfileSuccess.tsx`): Replaced ProfileApiOutput type with any

## Current State
✅ **Build Status**: All compilation errors resolved, project builds successfully
✅ **Authentication**: Login/register still work, redirect to role selection
✅ **Role Selection**: Interface works but doesn't persist profile data
✅ **Dashboards**: Load but don't show profile-specific data
✅ **Routing**: All routes work, profile routes redirect to dashboards temporarily

## What Needs to be Rebuilt

### 1. Core Profile Types
- `Profile` interface with common fields
- `JobSeekerProfile` and `EmployerProfile` specific interfaces
- `ProfileApiOutput` and `ProfileFormData` types
- Role-specific data structures

### 2. Redux Profile Slice
- Profile state management
- Profile CRUD actions (create, read, update)
- Profile completion tracking
- Local profile data handling

### 3. Profile API Layer
- `profileApi.ts` with all API endpoints
- Data transformation utilities
- Error handling and validation

### 4. Profile Components
- `JobSeekerProfile` component with integrated ThemeToggle
- `EmployerProfile` component with integrated ThemeToggle
- `ProfileForm` and form components
- `ProfileHeader` and display components with ThemeToggle support
- Skills, experience, and education managers
- ThemeToggle integration in all profile pages for consistent UI

#### Component Structure Example:
```tsx
// ProfileHeader.tsx
import { ThemeToggle } from '../../components/ThemeToggle';

export const ProfileHeader = ({ title, subtitle }) => (
  <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-gray-600 dark:text-gray-300">{subtitle}</p>}
        </div>
        <ThemeToggle />
      </div>
    </div>
  </div>
);
```

### 5. Profile Hooks
- `useProfile` - main profile data hook
- `useProfileUpdate` - profile update logic
- `useProfileValidation` - form validation
- `useProfileSubmission` - form submission logic

### 6. Profile Utils
- Profile completion calculation
- Profile data transformation
- Validation schemas and rules

### 7. Route Integration
- Restore profile routes in `App.tsx`
- Update `SmartRedirect` for profile flow
- Update `AuthGuard` for profile completion checks
- Update `ChooseRole` for profile creation

### 8. Authentication Integration
- Restore profile fetching in `LoginForm`
- Update dashboard profile data loading
- Restore avatar upload profile updates

### 9. ThemeToggle Integration
- Add ThemeToggle to all profile page headers (JobSeekerProfile, EmployerProfile)
- Ensure theme consistency across profile forms and components
- Maintain theme state during profile navigation and updates
- Test dark/light mode compatibility with new profile components

#### Implementation Details:
```tsx
// Import in all profile components
import { ThemeToggle } from '../../../components/ThemeToggle';

// Header structure for profile pages
<div className="header-container">
  <div className="flex justify-between items-center">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
    <ThemeToggle />
  </div>
</div>
```

#### Styling Guidelines:
- Use `dark:` prefixed classes for all new components
- Background: `bg-white dark:bg-gray-900`
- Text: `text-gray-900 dark:text-white`
- Borders: `border-gray-200 dark:border-gray-700`
- Form inputs: `bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`
- Cards/containers: `bg-gray-50 dark:bg-gray-800`

#### Testing Requirements:
- Theme switching should work during profile creation flow
- Theme switching should work during profile editing
- Form validation messages should be visible in both themes
- Loading states should be styled for both themes

#### Common Dark Mode Class Patterns:
```tsx
// Page containers
className="min-h-screen bg-gray-50 dark:bg-gray-900"

// Cards and sections  
className="bg-white dark:bg-gray-800 rounded-lg shadow"

// Form inputs
className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"

// Buttons (primary)
className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"

// Buttons (secondary)
className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"

// Text elements
className="text-gray-900 dark:text-white" // Primary text
className="text-gray-600 dark:text-gray-300" // Secondary text
className="text-gray-500 dark:text-gray-400" // Muted text

// Borders and dividers
className="border-gray-200 dark:border-gray-700"
```

## Development Approach
1. **Start with Types**: Define all profile-related TypeScript interfaces
2. **Build Redux Layer**: Create ProfileSlice with all actions and reducers
3. **Create API Layer**: Implement profile API service with backend integration
4. **Build Core Components**: Start with basic profile forms and displays, include ThemeToggle in headers
   - Import ThemeToggle: `import { ThemeToggle } from '../../../components/ThemeToggle'`
   - Place in header/navigation area of all profile pages
   - Apply dark/light mode classes to all elements
5. **Add Hooks**: Implement profile management hooks
6. **Integrate Routes**: Restore routing and navigation flow
7. **Add Features**: Implement advanced features like skills management
8. **Test Integration**: Verify full authentication and profile flow with theme switching

## Notes
- All existing authentication, cookie management, and logout functionality remains intact
- Backend API endpoints for profiles should remain unchanged
- Firebase avatar upload integration is preserved but profile updates are disabled
- **ThemeToggle component is preserved and should be integrated into all new profile components**
- Theme toggle, responsive design, and accessibility features are preserved
- All documentation files are preserved for reference

## Next Steps
1. Define the new profile type structure
2. Create the Redux profile slice
3. Implement the profile API layer
4. Build the core profile components with ThemeToggle integration
5. Integrate with the authentication flow
6. Test the complete user journey including theme switching
