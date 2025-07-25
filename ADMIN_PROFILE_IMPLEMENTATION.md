# Admin Profile Implementation

This document outlines the implementation of the Admin Profile in the Quickwork web application.

## Overview

The Admin Profile module enables users with admin roles to create and manage their profiles within the system. It follows the same pattern as the JobSeekerProfile and EmployerProfile components but with fields specific to administrators.

## Key Components

1. `AdminProfile.tsx`: Main component for rendering and managing admin profile data
2. Profile types extended to include the 'ADMIN' profile type and 'admin' user role
3. ProfileSlice updated to properly convert between backend and frontend profile formats
4. ProfileApi updated to handle admin profiles

## Data Structure

Admin profiles include the following fields:
- Full name (split into firstName and lastName for the UI)
- Professional title
- Phone number
- Location
- Bio (description)
- Profile picture (avatar)

## Integration with Backend

The admin profile type is sent to the backend as 'ADMIN' in the profileType field, consistent with the existing JOB_SEEKER and EMPLOYER types.

## Type Safety

- Added AdminProfile interface to profile.types.ts
- Updated Profile union type to include AdminProfile
- Updated ProfileType to include 'ADMIN'
- Added isAdmin helper to useProfile hook

## Navigation Flow

1. After successful admin profile creation, users are redirected to the admin dashboard
2. The admin dashboard includes a clickable avatar that navigates to the admin profile page
3. SmartRedirect component updated to properly route admin users

## Future Improvements

1. Add admin-specific fields like department, role permissions, etc.
2. Implement admin profile search functionality
3. Add avatar upload feature specific to admin users
