import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import profileReducer from './features/profile/ProfileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;