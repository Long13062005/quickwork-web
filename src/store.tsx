import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/AuthSlice';
import profileReducer from './features/profile/ProfileSlice';
import jobReducer from './features/job/jobSlice';
import applicationReducer from './features/application/applicationSlice';
import cvReducer from './features/cv/cvSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    job: jobReducer,
    application: applicationReducer,
    cv: cvReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;