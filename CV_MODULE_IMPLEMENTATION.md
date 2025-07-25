# CV Module Implementation

## Overview
The CV module provides comprehensive functionality for CV/resume management in the Quickwork application. It allows users to upload, manage, preview, download, and organize their CV files.

## Backend Entity Structure
The CV module is aligned with the backend `CVEntity` with the following fields:
- `id`: Primary key (Long)
- `profileId`: Reference to user profile (Long)
- `fileUrl`: URL to access the CV file (String)
- `storageKey`: Storage system key for the file (String)
- `originFilename`: Original filename when uploaded (String)
- `fileType`: MIME type of the file (String)
- `status`: CV status (ACTIVE, INACTIVE, DELETED)
- `createdAt`: Creation timestamp (LocalDateTime)
- `updatedAt`: Last update timestamp (LocalDateTime)

## Module Structure

### 1. Types (`src/features/cv/types/cv.types.ts`)
- **CVEntity**: Main CV entity interface
- **CVStatus**: Status enum (ACTIVE, INACTIVE, DELETED)
- **CVUploadRequest**: File upload request structure
- **CVSearchParams**: Search and pagination parameters
- **CVStatistics**: CV statistics interface
- **File validation constants**: Supported file types, max size, etc.

### 2. API Service (`src/services/cv/cvApi.ts`)
- **CVApiService**: Handles all CV-related API operations
- **Methods**:
  - `uploadCV()`: Upload new CV with progress tracking
  - `getMyCVs()`: Get paginated list of user's CVs
  - `getCVById()`: Get specific CV by ID
  - `updateCV()`: Update CV properties
  - `deleteCV()`: Soft delete CV
  - `downloadCV()`: Download CV file as blob
  - `previewCV()`: Preview CV in browser
  - `setActiveCV()`: Set CV as active (deactivate others)
  - `getCVStatistics()`: Get CV statistics

### 3. Redux Slice (`src/features/cv/cvSlice.ts`)
- **State Management**: Complete state management for CV operations
- **Async Thunks**: For all API operations with proper error handling
- **Reducers**: State updates and synchronization
- **State Structure**:
  - `cvs`: Array of CV entities
  - `currentCV`: Currently selected CV
  - `statistics`: CV statistics
  - `loading`: Loading states
  - `uploading`: Upload state
  - `uploadProgress`: File upload progress
  - `error`: Error messages
  - `searchParams`: Search parameters

### 4. Custom Hook (`src/features/cv/hooks/useCV.ts`)
- **useCV**: Main hook for CV operations
- **Features**:
  - State access and management
  - Action dispatching
  - File download helper
  - Preview functionality
  - Error handling

### 5. Components

#### CVUpload (`src/features/cv/components/CVUpload.tsx`)
- **Drag & Drop**: File upload with drag and drop support
- **Validation**: File type and size validation
- **Progress**: Upload progress tracking
- **Error Handling**: Comprehensive error messages
- **Supported Formats**: PDF, DOC, DOCX

#### CVList (`src/features/cv/components/CVList.tsx`)
- **CV Display**: List of user's CVs with metadata
- **Actions**: Preview, download, set active, delete
- **Status Indicators**: Visual status badges
- **Responsive Design**: Mobile-friendly layout

#### CVManager (`src/features/cv/components/CVManager.tsx`)
- **Unified Interface**: Combines upload and list functionality
- **Tab Navigation**: Switch between upload and list views
- **Statistics**: Dashboard with CV statistics
- **Integration**: Handles component communication

### 6. Page Component (`src/pages/CVPage.tsx`)
- **Full Page**: Complete CV management page
- **Header**: Page header with navigation
- **Main Content**: CVManager component
- **Responsive**: Mobile and desktop optimized

## API Endpoints
The module expects the following backend endpoints:

```
POST /api/cv/upload - Upload new CV
GET /api/cv/my-cvs - Get user's CVs (with pagination)
GET /api/cv/{id} - Get CV by ID
PUT /api/cv/{id} - Update CV
DELETE /api/cv/{id} - Delete CV
GET /api/cv/{id}/download - Download CV file
GET /api/cv/{id}/preview - Preview CV
POST /api/cv/{id}/set-active - Set CV as active
GET /api/cv/statistics - Get CV statistics
```

## Integration Points

### 1. Redux Store
Added to `src/store.tsx`:
```typescript
import cvReducer from './features/cv/cvSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    cv: cvReducer,
  },
});
```

### 2. Router Configuration
Added to `src/App.tsx`:
```typescript
<Route path="/resume" element={
  <ProtectedRoute requireAuth={true} requireProfile={true}>
    <CVPage />
  </ProtectedRoute>
} />
```

### 3. Dashboard Integration
- UserDashboard already has a link to `/resume` in quick actions
- The "Update Resume" action now leads to the CV management page

## Features

### File Upload
- **Drag & Drop**: Intuitive file selection
- **Validation**: File type (PDF, DOC, DOCX) and size (5MB max)
- **Progress**: Real-time upload progress
- **Error Handling**: Clear error messages

### CV Management
- **List View**: All user CVs with metadata
- **Actions**: Preview, download, set active, delete
- **Status Management**: Active/inactive status
- **Statistics**: Total, active, inactive, deleted counts

### File Operations
- **Preview**: Open CV in new tab/window
- **Download**: Download original file
- **Delete**: Soft delete (status change)
- **Set Active**: Mark CV as primary (deactivate others)

## Security & Validation
- **File Type Validation**: Only PDF, DOC, DOCX allowed
- **Size Limits**: 5MB maximum file size
- **Authentication**: All endpoints require user authentication
- **Authorization**: Users can only access their own CVs

## Error Handling
- **Upload Errors**: File validation, network errors
- **API Errors**: Proper error messages from backend
- **Loading States**: Loading indicators during operations
- **User Feedback**: Toast notifications for all actions

## Mobile Responsiveness
- **Responsive Design**: All components work on mobile
- **Touch Interactions**: Proper touch targets
- **Drag & Drop**: Touch-friendly file selection
- **Layout**: Optimized for different screen sizes

## Usage Examples

### Basic Usage
```typescript
import { useCV } from '../features/cv/hooks/useCV';

function MyComponent() {
  const { 
    cvs, 
    loading, 
    uploadCV, 
    getMyCVs, 
    deleteCV 
  } = useCV();

  // Upload CV
  const handleUpload = async (file: File) => {
    await uploadCV({ file });
  };

  // Get CVs
  useEffect(() => {
    getMyCVs();
  }, []);

  return (
    <div>
      {cvs.map(cv => (
        <div key={cv.id}>{cv.originFilename}</div>
      ))}
    </div>
  );
}
```

### Component Usage
```typescript
import { CVManager } from '../features/cv/components/CVManager';

function CVPage() {
  return (
    <div>
      <CVManager />
    </div>
  );
}
```

## Future Enhancements
- **CV Templates**: Pre-built CV templates
- **AI Resume Review**: AI-powered resume optimization
- **Version Control**: Track CV versions
- **Sharing**: Share CV with employers
- **Analytics**: Track CV views and downloads
- **Batch Operations**: Multiple CV actions
- **Integration**: Link with job applications

## Testing
- Unit tests for hooks and utilities
- Component tests for UI interactions
- Integration tests for API operations
- E2E tests for complete workflows

## Performance Optimizations
- Lazy loading for large file lists
- Chunked file uploads for large files
- Caching for frequently accessed data
- Optimistic updates for better UX

This CV module provides a comprehensive solution for CV management with modern React patterns, proper TypeScript support, and excellent user experience.
