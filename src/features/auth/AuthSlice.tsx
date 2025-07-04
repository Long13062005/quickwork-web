import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/auth';
import type { UserProfile, LoginPayload, RegisterPayload } from '../../services/auth';
export const login = createAsyncThunk<
  UserProfile,
  LoginPayload,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authAPI.login(credentials);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

// Add authentication check on app startup
export const checkAuthStatus = createAsyncThunk<
  boolean,
  void,
  { rejectValue: string }
>('auth/checkAuthStatus', async () => {
  try {
    // For cookie-based auth, we need to make a request to check if cookies are valid
    // We'll make a simple request to a protected endpoint
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:1010/api'}/auth/me`, {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('AuthSlice: User is authenticated (cookies valid)');
      return true;
    } else {
      console.log('AuthSlice: User is not authenticated (cookies invalid/missing)');
      return false;
    }
  } catch (err: any) {
    console.log('AuthSlice: Auth check failed, assuming not authenticated');
    return false; // Assume not authenticated if check fails
  }
});

export const register = createAsyncThunk<
  UserProfile,
  RegisterPayload,
  { rejectValue: string }
>('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const res = await authAPI.register(userData);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const checkEmailExist = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>('auth/checkEmailExist', async (email, { rejectWithValue }) => {
  try {
    const res = await authAPI.checkEmailExist(email);
    return res.data; // API returns boolean directly
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Email check failed');
  }
});

interface AuthState { 
  isAuthenticated: boolean;
  status: string; 
  error: string | null;
  emailExists: boolean | null;
  emailCheckStatus: string;
  isInitialized: boolean; // Track if auth check is complete
}

const initialState: AuthState = { 
  isAuthenticated: false,
  status: 'idle', 
  error: null,
  emailExists: null,
  emailCheckStatus: 'idle',
  isInitialized: false // Start as false, will be true after auth check
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    logout(state) { 
      state.isAuthenticated = false;
      state.isInitialized = true; // Keep initialized state
      state.status = 'idle'; 
    },
    clearEmailCheck(state) {
      state.emailExists = null;
      state.emailCheckStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(login.fulfilled, (s) => { s.status = 'succeeded'; s.isAuthenticated = true; })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload as string; })
      
      // Register cases
      .addCase(register.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(register.fulfilled, (s) => { s.status = 'succeeded'; s.isAuthenticated = true; })
      .addCase(register.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload as string; })
      
      // Email check cases
      .addCase(checkEmailExist.pending, (s) => { s.emailCheckStatus = 'loading'; })
      .addCase(checkEmailExist.fulfilled, (s, a) => { s.emailCheckStatus = 'succeeded'; s.emailExists = a.payload; })
      .addCase(checkEmailExist.rejected, (s, a) => { s.emailCheckStatus = 'failed'; s.error = a.payload as string; })
      
      // Auth status check cases
      .addCase(checkAuthStatus.pending, (s) => { s.status = 'loading'; s.isInitialized = false; })
      .addCase(checkAuthStatus.fulfilled, (s, a) => { 
        s.status = 'succeeded'; 
        s.isAuthenticated = a.payload; 
        s.isInitialized = true;
        s.error = null;
      })
      .addCase(checkAuthStatus.rejected, (s) => { 
        s.status = 'idle'; 
        s.isAuthenticated = false; 
        s.isInitialized = true;
        s.error = null; // Don't show error for unauthenticated state
      });
  },
});

export const { logout, clearEmailCheck } = authSlice.actions;
export default authSlice.reducer;
