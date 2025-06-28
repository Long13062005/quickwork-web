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

export const fetchProfile = createAsyncThunk<UserProfile>(
  'auth/fetchProfile', async () => {
    const res = await authAPI.getProfile();
    return res.data;
  }
);

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
  user: UserProfile | null; 
  status: string; 
  error: string | null;
  emailExists: boolean | null;
  emailCheckStatus: string;
}

const initialState: AuthState = { 
  user: null, 
  status: 'idle', 
  error: null,
  emailExists: null,
  emailCheckStatus: 'idle'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { 
    logout(state) { 
      state.user = null; 
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
      .addCase(login.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload as string; })
      
      // Register cases
      .addCase(register.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(register.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(register.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload as string; })
      
      // Email check cases
      .addCase(checkEmailExist.pending, (s) => { s.emailCheckStatus = 'loading'; })
      .addCase(checkEmailExist.fulfilled, (s, a) => { s.emailCheckStatus = 'succeeded'; s.emailExists = a.payload; })
      .addCase(checkEmailExist.rejected, (s, a) => { s.emailCheckStatus = 'failed'; s.error = a.payload as string; })
      
      // Fetch profile case
      .addCase(fetchProfile.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { logout, clearEmailCheck } = authSlice.actions;
export default authSlice.reducer;
