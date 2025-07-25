# Application Delete Functionality Implementation

## Overview
Added delete application functionality to match the backend API endpoint that allows users and employers to delete applications.

## Backend API Integration
**Endpoint:** `DELETE /applications/{applicationId}`
**Authorization:** `@PreAuthorize("hasRole('USER') or hasRole('EMPLOYER')")`
**Response:** `{"message": "Application deleted successfully"}`

## Frontend Implementation

### 1. Service Layer Updates
**File:** `src/services/application.ts`

#### Added Endpoint
```typescript
DELETE_APPLICATION: (id: number) => `/applications/${id}`,
```

#### Added API Method
```typescript
/**
 * Delete application (requires USER or EMPLOYER role)
 */
static async deleteApplication(id: number): Promise<void> {
  await api.delete(APPLICATION_ENDPOINTS.DELETE_APPLICATION(id));
}
```

#### Updated API Export
```typescript
export const jobApplicationAPI = {
  // ...existing methods
  deleteApplication: JobApplicationAPI.deleteApplication,
  // ...other methods
};
```

### 2. Redux Slice Updates
**File:** `src/features/application/applicationSlice.ts`

#### Added Async Thunk
```typescript
// Delete application
export const deleteApplication = createAsyncThunk(
  'jobApplication/deleteApplication',
  async (id: number) => {
    await jobApplicationAPI.deleteApplication(id);
    return id;
  }
);
```

#### Added Reducer Cases
```typescript
// Delete application
.addCase(deleteApplication.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deleteApplication.fulfilled, (state, action) => {
  state.loading = false;
  const deletedId = action.payload;
  
  // Remove from my applications
  const deletedApp = state.myApplications.find(app => app.id === deletedId);
  state.myApplications = state.myApplications.filter(app => app.id !== deletedId);
  
  // Remove from all applications array
  state.applications = state.applications.filter(app => app.id !== deletedId);
  
  // Remove from applied jobs if found
  if (deletedApp) {
    state.appliedJobs = state.appliedJobs.filter(jobId => jobId !== deletedApp.jobId);
  }
  
  // Clear current application if it's the deleted one
  if (state.currentApplication?.id === deletedId) {
    state.currentApplication = null;
  }
})
.addCase(deleteApplication.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message || 'Failed to delete application';
})
```

## Key Features

### 1. State Management
- **Loading State**: Shows loading indicator during deletion
- **Error Handling**: Captures and displays deletion errors
- **Multi-Array Updates**: Removes application from both `myApplications` and `applications` arrays
- **Applied Jobs Tracking**: Updates the `appliedJobs` array to remove the deleted application's job ID
- **Current Application Cleanup**: Clears `currentApplication` if it matches the deleted application

### 2. Data Consistency
- Removes application from all relevant state arrays
- Updates job application tracking
- Maintains referential integrity across the application state

### 3. Error Handling
- Provides meaningful error messages
- Handles network failures gracefully
- Maintains application state consistency on errors

## Usage Example

```typescript
import { useAppDispatch } from '../hooks/redux';
import { deleteApplication } from '../features/application/applicationSlice';

const dispatch = useAppDispatch();

const handleDeleteApplication = async (applicationId: number) => {
  try {
    await dispatch(deleteApplication(applicationId)).unwrap();
    // Success handling
    toast.success('Application deleted successfully');
  } catch (error) {
    // Error handling
    toast.error('Failed to delete application');
  }
};
```

## Differences from Withdraw Application

| Feature | Withdraw Application | Delete Application |
|---------|---------------------|-------------------|
| **HTTP Method** | PUT | DELETE |
| **Endpoint** | `/applications/{id}/withdraw` | `/applications/{id}` |
| **Purpose** | Cancel/withdraw application | Permanently delete application |
| **State Updates** | Same as delete | Same as withdraw |
| **Authorization** | JOB_SEEKER role | USER or EMPLOYER role |

## Benefits
- ✅ **Complete CRUD Operations**: Full application lifecycle management
- ✅ **Role-Based Access**: Both users and employers can delete applications
- ✅ **State Consistency**: Maintains application state integrity
- ✅ **Error Handling**: Robust error management and user feedback
- ✅ **Loading States**: Provides visual feedback during operations
- ✅ **Type Safety**: Full TypeScript support with proper typing

## Testing Considerations
- Test deletion for both user and employer roles
- Verify state cleanup after successful deletion
- Test error handling for failed deletions
- Ensure UI updates correctly after deletion
- Test edge cases (deleting non-existent applications)

## Security Notes
- Backend enforces proper authorization (USER or EMPLOYER roles)
- Frontend should implement appropriate UI access controls
- Deletion is permanent and should include confirmation dialogs
- Consider implementing soft delete for audit trails (backend consideration)
