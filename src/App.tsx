import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'
import { PageLoader } from './components/PageLoader'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthFlowGuard } from './components/AuthFlowGuard'

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const BeforeAuth = lazy(() => import('./pages/BeforeAuth'))
const ChooseRole = lazy(() => import('./pages/ChooseRole'))
const ProfileSuccess = lazy(() => import('./pages/ProfileSuccess'))

// Lazy load profile components
const JobSeekerProfile = lazy(() => import('./features/profile/components/JobSeekerProfile'))
const EmployerProfile = lazy(() => import('./features/profile/components/EmployerProfile'))
const ProfileApiDemo = lazy(() => import('./features/profile/components/ProfileApiDemo'))


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Root redirect to auth landing page */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Authentication routes */}
          <Route path="/auth" element={<BeforeAuth />} />
          <Route path="/auth/login" element={
            <AuthFlowGuard requireEmailCheck={true}>
              <Login />
            </AuthFlowGuard>
          } />
          <Route path="/auth/register" element={
            <AuthFlowGuard requireEmailCheck={true}>
              <Register />
            </AuthFlowGuard>
          } />
          <Route path="/auth/choose-role" element={
            <ProtectedRoute requireAuth={true} requireProfile={false}>
              <ChooseRole />
            </ProtectedRoute>
          } />
          
          {/* Profile routes - require authentication and profile completion */}
          <Route path="/profile/job-seeker" element={
            <ProtectedRoute requireAuth={true} requireProfile={false}>
              <JobSeekerProfile />
            </ProtectedRoute>
          } />
          <Route path="/profile/employer" element={
            <ProtectedRoute requireAuth={true} requireProfile={false}>
              <EmployerProfile />
            </ProtectedRoute>
          } />
          
          {/* Profile success route */}
          <Route path="/profile/success" element={
            <ProtectedRoute requireAuth={true} requireProfile={false}>
              <ProfileSuccess />
            </ProtectedRoute>
          } />
          
          {/* Profile API demo route */}
          <Route path="/profile/demo" element={<ProfileApiDemo />} />
          
          {/* Catch-all route for 404 - redirect to auth for now */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
