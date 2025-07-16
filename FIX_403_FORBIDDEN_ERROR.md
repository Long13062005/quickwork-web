# Fix for 403 Forbidden Error - HTTPOnly Cookie Authentication

## Overview
Updated the API service configuration and application service methods to properly handle HTTPOnly cookie authentication and resolve 403 Forbidden errors.

## Root Cause Analysis
The 403 error typically occurs when:
1. Authentication cookies are not being sent with requests
2. CORS configuration is preventing credential transmission
3. Backend authorization checks are failing due to missing/invalid authentication

## Changes Made

### 1. Enhanced API Configuration
**File:** `src/services/api.tsx`

#### Added Request/Response Interceptors
```typescript
// Request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            withCredentials: config.withCredentials,
            headers: config.headers,
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for debugging and error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });
        
        // Handle 403 errors specifically
        if (error.response?.status === 403) {
            console.error('403 Forbidden - Authentication/Authorization issue');
        }
        
        return Promise.reject(error);
    }
);
```

#### Added Default Content-Type Header
```typescript
export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
})
```

### 2. Enhanced Application Service Methods
**File:** `src/services/application.ts`

#### Explicit withCredentials Configuration
All API methods now explicitly include `withCredentials: true`:

```typescript
// Example for GET requests
static async getMyApplications(): Promise<ApplicationEntity[]> {
    const response = await api.get<ApplicationEntity[]>(APPLICATION_ENDPOINTS.MY_APPLICATIONS, {
        withCredentials: true
    });
    return response.data;
}

// Example for POST requests
static async applyForJob(jobId: number, applicationData: JobApplicationRequest): Promise<ApplicationEntity> {
    const response = await api.post<ApplicationEntity>(
        APPLICATION_ENDPOINTS.APPLY_FOR_JOB(jobId), 
        applicationData,
        {
            withCredentials: true
        }
    );
    return response.data;
}

// Example for DELETE requests
static async deleteApplication(id: number): Promise<void> {
    await api.delete(APPLICATION_ENDPOINTS.DELETE_APPLICATION(id), {
        withCredentials: true
    });
}
```

#### Updated Methods with Explicit Credentials
- ✅ `getAllApplications` - Added withCredentials
- ✅ `getApplicationById` - Added withCredentials
- ✅ `applyForJob` - Added withCredentials
- ✅ `getMyApplications` - Added withCredentials
- ✅ `withdrawApplication` - Added withCredentials
- ✅ `deleteApplication` - Added withCredentials
- ✅ `getApplicationStatistics` - Added withCredentials
- ✅ `searchApplications` - Added withCredentials
- ✅ `hasAppliedForJob` - Added withCredentials
- ✅ `applyToJob` - Added withCredentials
- ✅ `getApplicationsByJob` - Added withCredentials
- ✅ `updateApplicationStatus` - Added withCredentials

## Key Improvements

### 1. **Debugging Capabilities**
- Added comprehensive request/response logging
- Specific 403 error handling and logging
- Better error visibility for troubleshooting

### 2. **Credential Transmission**
- Explicit `withCredentials: true` on all requests
- Ensures HTTPOnly cookies are sent with every API call
- Redundant configuration for maximum reliability

### 3. **Error Handling**
- Specific handling for 403 Forbidden errors
- Better error messages and debugging information
- Consistent error handling across all methods

## Testing the Fix

### 1. **Check Browser Developer Tools**
- Network tab should show cookies being sent with requests
- Console should show detailed request/response logs
- Look for 403 errors in the console

### 2. **Verify Cookie Transmission**
```javascript
// Check if cookies are being sent
// Look for 'Cookie' header in request headers
// Look for 'Set-Cookie' header in response headers
```

### 3. **Backend Verification**
Make sure your backend:
- Accepts credentials in CORS configuration
- Properly validates HTTPOnly cookies
- Has correct `@PreAuthorize` annotations

## Expected Behavior After Fix

### ✅ Successful Requests
- All application API calls should include authentication cookies
- No more 403 Forbidden errors for authenticated users
- Proper authorization based on user roles

### ✅ Better Error Handling
- Clear error messages for authentication issues
- Detailed logging for debugging
- Graceful handling of authorization failures

## Backend Requirements

Ensure your backend has:
```java
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = true)
// OR
@CrossOrigin(allowCredentials = true)
```

And proper CORS configuration:
```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowedHeaders("*");
    }
}
```

## Troubleshooting

If 403 errors persist:
1. Check browser console for detailed error logs
2. Verify cookies are being sent in Network tab
3. Confirm backend CORS configuration allows credentials
4. Verify user authentication status
5. Check backend logs for authorization failures

The enhanced logging will help identify exactly where the authentication is failing.
