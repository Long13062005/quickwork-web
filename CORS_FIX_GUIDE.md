# CORS Fix and Backend Integration - UPDATED

## Problem Description
Getting CORS error when frontend (localhost:5173) tries to communicate with backend (localhost:1010):
```
Access to fetch at 'http://localhost:1010/api/profile/temp_1751209155079' from origin 'http://localhost:5173' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ SOLUTION IMPLEMENTED

The issue has been **FIXED** by updating the API service to use relative URLs that leverage the Vite proxy configuration.

### Changes Made

#### 1. Updated API Service (`src/services/api.tsx`)
```typescript
import axios from 'axios'

// Use environment variable for API URL, fallback to relative URL for development proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})
```

**Before:** Used absolute URL `http://localhost:1010/api` causing CORS issues
**After:** Uses relative URL `/api` which is proxied by Vite to the backend

#### 2. Updated Environment Configuration
Both `.env.example` and `.env.local` have been updated:
```bash
# API Configuration
# Backend API URL (leave empty for development to use Vite proxy)
# Set this for production deployment
# VITE_API_URL=https://your-production-api.com/api
```

### How the Fix Works

### 1. Vite Proxy Configuration
Updated `vite.config.ts` to proxy API requests to the backend:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:1010',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          // Add logging for debugging
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  }
})
```

### 2. API Service Configuration
Updated ProfileApiService to use relative URLs in development:

```typescript
// Before (caused CORS error)
const API_BASE_URL = 'http://localhost:1010/api';

// After (uses proxy)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';
```

### 3. Environment Configuration
Updated environment files to support both development and production:

```env
# .env.local
# For development, this is commented out to use proxy
# VITE_API_URL=http://localhost:1010/api

# For production, uncomment and set to actual backend URL
# VITE_API_URL=https://api.yourdomain.com/api
```

## How the Proxy Works

### Development Flow (with Proxy)
1. Frontend makes request to `/api/profile` (relative URL)
2. Vite proxy intercepts the request
3. Proxy forwards to `http://localhost:1010/api/profile`
4. Backend responds to proxy
5. Proxy forwards response to frontend
6. **No CORS issues** because the request appears to come from the same origin

### Request Flow
```
Frontend (localhost:5173) 
    ↓ GET /api/profile
Vite Proxy 
    ↓ GET http://localhost:1010/api/profile
Backend (localhost:1010)
    ↓ Response
Vite Proxy
    ↓ Response 
Frontend (localhost:5173)
```

## Backend CORS Configuration (Required)

Even with the frontend proxy, you should configure CORS on the backend for production and direct API access.

### Spring Boot CORS Configuration

#### Option 1: Global CORS Configuration
```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins (development and production)
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // Alternative React dev server
            "https://yourapp.com"     // Production domain
        ));
        
        // Allow specific methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        
        // Allow specific headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Content-Type", 
            "Authorization", 
            "X-Requested-With",
            "Accept",
            "Origin"
        ));
        
        // Allow credentials (for cookies/auth)
        configuration.setAllowCredentials(true);
        
        // Cache preflight response
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
}
```

#### Option 2: Controller-Level CORS
```java
@RestController
@RequestMapping("/api/profile")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:3000"},
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, 
               RequestMethod.PATCH, RequestMethod.DELETE},
    allowCredentials = "true"
)
public class ProfileController {
    // ... controller methods
}
```

#### Option 3: Method-Level CORS
```java
@GetMapping("/me")
@CrossOrigin(origins = "http://localhost:5173")
public ResponseEntity<ProfileResponse> getCurrentProfile() {
    // ... method implementation
}
```

### Important CORS Headers
Make sure your backend sends these headers:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 3600
```

## Testing the Fix

### 1. Start the Backend
Ensure your Spring Boot backend is running on `localhost:1010`

### 2. Start the Frontend
```bash
cd quickwork-web
npm run dev
```

### 3. Verify Proxy is Working
Check the console for proxy logs:
```
Sending Request to the Target: GET /api/profile/me
Received Response from the Target: 200 /api/profile/me
```

### 4. Check Network Tab
In browser DevTools → Network tab:
- Request URL should be `http://localhost:5173/api/profile/me`
- No CORS errors should appear

## Production Deployment

### Frontend Production Build
For production, set the full backend URL:

```env
# .env.production
VITE_API_URL=https://api.yourdomain.com/api
```

### Backend Production CORS
Update CORS configuration to include production domains:

```java
configuration.setAllowedOrigins(Arrays.asList(
    "https://yourapp.com",
    "https://www.yourapp.com"
));
```

## Troubleshooting

### Common Issues

#### 1. Proxy Not Working
- Check Vite dev server is running on port 5173
- Verify backend is running on port 1010
- Check console for proxy error logs

#### 2. CORS Still Appears
- Ensure using relative URLs (`/api/...` not `http://localhost:1010/api/...`)
- Check browser cache (hard refresh with Ctrl+Shift+R)
- Verify backend CORS configuration

#### 3. 404 Errors
- Check backend endpoint exists
- Verify API path matches backend routes
- Check proxy target URL is correct

#### 4. Authentication Issues
- Ensure `credentials: 'include'` is set
- Backend must set `Access-Control-Allow-Credentials: true`
- Use HTTPS in production for secure cookies

### Debug Commands

#### Check if backend is running:
```bash
curl http://localhost:1010/api/profile/me
```

#### Test CORS with curl:
```bash
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:1010/api/profile/me
```

## Benefits of This Solution

### ✅ **Development Experience**
- No CORS errors during development
- Easy debugging with proxy logs
- Same-origin requests (no preflight complexity)

### ✅ **Production Ready**
- Proper CORS configuration for production
- Environment-based API URL configuration
- Secure cookie handling

### ✅ **Flexible Configuration**
- Easy to switch between proxy and direct requests
- Support for multiple environments
- Clean separation of concerns

## Next Steps

1. **Implement Backend CORS**: Add CORS configuration to your Spring Boot application
2. **Test API Endpoints**: Verify all profile endpoints work with the new setup
3. **Authentication Integration**: Ensure auth cookies work with CORS setup
4. **Production Deployment**: Configure production CORS and API URLs

This solution eliminates CORS issues during development while maintaining proper security for production deployment.
