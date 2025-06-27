import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'
import { PageLoader } from './components/PageLoader'

// Lazy load components for better performance
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const BeforeAuth = lazy(() => import('./pages/BeforeAuth'))

// Beautiful loading component with professional design


function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Root redirect to auth landing page */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          
          {/* Authentication routes */}
          <Route path="/auth" element={<BeforeAuth />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          
          {/* Catch-all route for 404 - redirect to auth for now */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App
