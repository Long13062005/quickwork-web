import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'
import { PageLoader } from './components/PageLoader'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthFlowGuard } from './components/AuthFlowGuard'
import { AppInitializer } from './components/AppInitializer'
import { SmartRedirect } from './components/SmartRedirect'

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const BeforeAuth = lazy(() => import('./pages/BeforeAuth'))
const ChooseRole = lazy(() => import('./pages/ChooseRole'))
const ProfileSuccess = lazy(() => import('./pages/ProfileSuccess'))

// Lazy load dashboard components
const UserDashboard = lazy(() => import('./pages/UserDashboard'))
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

// Lazy load profile components
const JobSeekerProfile = lazy(() => import('./features/profile/components/JobSeekerProfile'))
const EmployerProfile = lazy(() => import('./features/profile/components/EmployerProfile'))
const AdminProfile = lazy(() => import('./features/profile/components/AdminProfile'))


function App() {
  return (
    <BrowserRouter>
      <AppInitializer>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Smart root redirect based on authentication status */}
            <Route path="/" element={<SmartRedirect />} />
            
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
            
            {/* Dashboard routes - require authentication and completed profile */}
            <Route path="/dashboard" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/employer/dashboard" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <EmployerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Profile routes */}
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
            <Route path="/profile/admin" element={
              <ProtectedRoute requireAuth={true} requireProfile={false}>
                <AdminProfile />
              </ProtectedRoute>
            } />
            
            {/* Profile success route */}
            <Route path="/profile/success" element={
              <ProtectedRoute requireAuth={true} requireProfile={false}>
                <ProfileSuccess />
              </ProtectedRoute>
            } />
            
            {/* Profile API demo route - TODO: Re-implement when profile module is rebuilt */}
            {/* <Route path="/profile/demo" element={<ProfileApiDemo />} /> */}
            
            {/* Catch-all route for 404 - use smart redirect */}
            <Route path="*" element={<SmartRedirect />} />
          </Routes>
        </Suspense>
      </AppInitializer>
    </BrowserRouter>
  )
}

export default App
