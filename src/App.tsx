import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'
import { PageLoader } from './components/PageLoader'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthFlowGuard } from './components/AuthFlowGuard'
import { AppInitializer } from './components/AppInitializer'
import { SmartRedirect } from './components/SmartRedirect'
import { LanguageProvider } from './contexts/LanguageContext'

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const BeforeAuth = lazy(() => import('./pages/BeforeAuth'))
const ChooseRole = lazy(() => import('./pages/ChooseRole'))
const ProfileSuccess = lazy(() => import('./pages/ProfileSuccess'))
const Bundles = lazy(() => import('./pages/Bundles'))
const Payment = lazy(() => import('./pages/Payment'))

// Lazy load dashboard components
const UserDashboard = lazy(() => import('./pages/UserDashboard'))
const EmployerDashboard = lazy(() => import('./pages/EmployerDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ChangePassword = lazy(() => import('./pages/ChangePassword'))

// Lazy load profile components
const JobSeekerProfile = lazy(() => import('./features/profile/components/JobSeekerProfile'))
const EmployerProfile = lazy(() => import('./features/profile/components/EmployerProfile'))
const AdminProfile = lazy(() => import('./features/profile/components/AdminProfile'))

// Lazy load job components
const JobListing = lazy(() => import('./pages/JobListing'))
const JobDetail = lazy(() => import('./pages/JobDetail'))
const JobFavorites = lazy(() => import('./pages/JobFavorites'))
const JobManagement = lazy(() => import('./pages/JobManagement'))

// Lazy load application components
const MyApplications = lazy(() => import('./pages/MyApplications'))


function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppInitializer>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Landing Page Route */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Bundles Page Route */}
            <Route path="/bundles" element={<Bundles />} />
            
            {/* Payment Route */}
            <Route path="/payment/:bundleId" element={<Payment />} />
            
            {/* Smart redirect for authenticated users */}
            <Route path="/dashboard-redirect" element={<SmartRedirect />} />
            
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
            
            {/* Change Password route - requires authentication */}
            <Route path="/change-password" element={
              <ProtectedRoute requireAuth={true} requireProfile={false}>
                <ChangePassword />
              </ProtectedRoute>
            } />
            
            {/* Job routes */}
            <Route path="/jobs" element={<JobListing />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/jobs/favorites" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <JobFavorites />
              </ProtectedRoute>
            } />
            <Route path="/jobs/manage" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <JobManagement />
              </ProtectedRoute>
            } />
            
            {/* Application routes */}
            <Route path="/applications" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <MyApplications />
              </ProtectedRoute>
            } />
            
            {/* Application routes */}
            <Route path="/applications" element={
              <ProtectedRoute requireAuth={true} requireProfile={true}>
                <MyApplications />
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
    </LanguageProvider>
  )
}

export default App
