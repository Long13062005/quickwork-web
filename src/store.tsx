import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import profileReducer from './features/profile/ProfileSlice';
import jobReducer from './features/job/jobSlice';
import applicationReducer from './features/application/applicationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    job: jobReducer,
    application: applicationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;