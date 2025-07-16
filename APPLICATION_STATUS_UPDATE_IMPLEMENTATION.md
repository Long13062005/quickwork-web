# Application Status Update Implementation

## Overview
Updated the application deletion/withdrawal functionality to use status updates instead of hard deletion, following the backend API changes.

## Backend API Endpoints

### Status Update Endpoint
```java
@PutMapping("/{applicationId}/status")
@PreAuthorize("hasRole('EMPLOYER') or hasRole('USER')")
public ResponseEntity<?> updateApplicationStatus(@PathVariable Long applicationId, @RequestBody String status) {
    try {
        ApplicationStatus applicationStatus = ApplicationStatus.valueOf(status.toUpperCase());
        ApplicationEntity updatedApplication = applicationService.updateApplicationStatus(applicationId, applicationStatus);
        return ResponseEntity.ok(updatedApplication);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

### Withdraw Application Endpoint
```java
@PutMapping("/withdraw/job/{jobId}")
@PreAuthorize("hasRole('USER')")
public ResponseEntity<?> withdrawApplicationByJobId(@PathVariable Long jobId) {
    try {
        ApplicationEntity withdrawnApplication = applicationService.withdrawApplicationByJobId(jobId);
        return ResponseEntity.ok(withdrawnApplication);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}
```

## Changes Made

### 1. Updated Application Service (`src/services/application.ts`)

#### `withdrawApplication` Method:
- **Before**: Used DELETE endpoint and returned `void`
- **After**: Uses PUT endpoint with job ID parameter and returns `ApplicationEntity`

```typescript
static async withdrawApplication(jobId: number): Promise<ApplicationEntity> {
  const response = await api.put<ApplicationEntity>(
    APPLICATION_ENDPOINTS.WITHDRAW_BY_JOB_ID(jobId),
    {},
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    }
  );
  return response.data;
}
```

#### `deleteApplication` Method:
- **Before**: Used DELETE endpoint and returned `void`
- **After**: Uses PUT endpoint with status update and returns `ApplicationEntity`

```typescript
static async deleteApplication(id: number): Promise<ApplicationEntity> {
  const response = await api.put<ApplicationEntity>(
    APPLICATION_ENDPOINTS.UPDATE_STATUS(id), 
    'WITHDRAWN',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    }
  );
  return response.data;
}
```

### 3. Updated Frontend Component (`src/pages/MyApplications.tsx`)

#### Handler Function:
- **Before**: Passed application ID directly to the thunk
- **After**: Finds application by ID and passes job ID to the thunk

```typescript
const handleWithdrawApplication = async (applicationId: number) => {
  try {
    // Find the application to get its jobId
    const application = myApplications.find(app => app.id === applicationId);
    if (!application) {
      console.error('Application not found');
      return;
    }
    
    await dispatch(withdrawApplication(application.jobId)).unwrap();
  } catch (error) {
    console.error('Failed to withdraw application:', error);
  }
};
```

### 4. Updated Redux Slice (`src/features/application/applicationSlice.ts`)

#### Async Thunks:
- Updated `withdrawApplication` thunk to accept job ID instead of application ID
- Maintains the same return type (ApplicationEntity)

```typescript
export const withdrawApplication = createAsyncThunk(
  'jobApplication/withdrawApplication',
  async (jobId: number) => {
    const response = await jobApplicationAPI.withdrawApplication(jobId);
    return response;
  }
);
```

#### Reducer Cases:
- **Before**: Removed applications from state arrays
- **After**: Updates application status in-place in all relevant state arrays
- Maintains application data with updated status instead of removing it

```typescript
// Now updates the application status instead of removing it
.addCase(withdrawApplication.fulfilled, (state, action) => {
  state.loading = false;
  const withdrawnApp = action.payload;
  
  // Update the application status in myApplications
  const appIndex = state.myApplications.findIndex(app => app.id === withdrawnApp.id);
  if (appIndex !== -1) {
    state.myApplications[appIndex] = withdrawnApp;
  }
  
  // Update in all applications array if present
  const allAppIndex = state.applications.findIndex(app => app.id === withdrawnApp.id);
  if (allAppIndex !== -1) {
    state.applications[allAppIndex] = withdrawnApp;
  }
  
  // Update current application if it's the withdrawn one
  if (state.currentApplication?.id === withdrawnApp.id) {
    state.currentApplication = withdrawnApp;
  }
})
```

## Key Benefits

1. **Data Preservation**: Applications are no longer permanently deleted, maintaining historical data
2. **Status Tracking**: Applications now have a clear "WITHDRAWN" status for auditing and reporting
3. **Consistent API**: Both frontend and backend now use the same status update approach
4. **Better UX**: Users can see the status of their withdrawn applications
5. **Audit Trail**: Maintains complete application history for compliance and analytics

## Status Values
The system uses the following status values:
- `WITHDRAWN`: When user withdraws/deletes their application
- Other statuses: `PENDING`, `APPROVED`, `REJECTED`, etc. (as defined in ApplicationStatus enum)

## Testing
- Verify that withdrawn applications show up with "WITHDRAWN" status
- Ensure proper error handling for invalid status values
- Test that the UI properly reflects the status changes
- Confirm that HTTPOnly cookies are properly sent with the PUT request

## Next Steps
1. Update UI components to properly display withdrawn applications
2. Add filtering options to hide/show withdrawn applications
3. Consider adding a "reactivate" functionality for withdrawn applications
4. Update any reports or analytics to account for withdrawn vs. deleted applications
