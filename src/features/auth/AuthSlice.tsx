import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/auth';
import type { UserProfile } from '../../services/auth';
import type { LoginPayload } from '../../services/auth';
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

interface AuthState { user: UserProfile | null; status: string; error: string | null; }
const initialState: AuthState = { user: null, status: 'idle', error: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: { logout(state) { state.user = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.status = 'loading'; s.error = null; })
      .addCase(login.fulfilled, (s, a) => { s.status = 'succeeded'; s.user = a.payload; })
      .addCase(login.rejected, (s, a) => { s.status = 'failed'; s.error = a.payload as string; })
      .addCase(fetchProfile.fulfilled, (s, a) => { s.user = a.payload; });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
