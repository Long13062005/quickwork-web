/**
 * Change Password Page
 * Allows authenticated users to change their password
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, NavLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useProfile } from '../features/profile/hooks/useProfile';
import { authAPI } from '../services/auth';
import { ThemeToggle } from '../components/ThemeToggle';
import { PageLoader } from '../components/PageLoader';

// Icons
const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const LockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

interface ChangePasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Current password is required'),
  newPassword: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Please confirm your new password'),
});

// Helper function to get dashboard path based on user role
const getDashboardPath = (role?: string) => {
  switch (role) {
    case 'jobseeker':
      return '/dashboard';
    case 'employer':
      return '/employer/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

export default function ChangePassword() {
  const navigate = useNavigate();
  const { currentProfile, loading: profileLoading } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (values: ChangePasswordFormValues) => {
    setIsLoading(true);
    
    try {
      // Call change password API
      await authAPI.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      });
      
      toast.success('Password changed successfully!');
      
      // Navigate back to dashboard
      const dashboardPath = getDashboardPath(currentProfile?.role);
      navigate(dashboardPath);
      
    } catch (error: any) {
      console.error('Change password error:', error);
      
      if (error.response?.status === 400) {
        toast.error('Current password is incorrect');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/auth/login');
      } else {
        toast.error('Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    const dashboardPath = getDashboardPath(currentProfile?.role);
    navigate(dashboardPath);
  };

  if (profileLoading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-md mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleGoBack}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
            <ThemeToggle variant="compact" />
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
              <LockIcon className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Change Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your password to keep your account secure
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Current Password */}
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Field
                      id="currentPassword"
                      name="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600 pr-10 ${
                        errors.currentPassword && touched.currentPassword
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {showCurrentPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* New Password */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <Field
                      id="newPassword"
                      name="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600 pr-10 ${
                        errors.newPassword && touched.newPassword
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {showNewPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Must be at least 6 characters with uppercase, lowercase, and number
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`w-full px-3 py-2 border rounded-md shadow-sm transition-colors dark:bg-gray-700 dark:text-white dark:border-gray-600 pr-10 ${
                        errors.confirmPassword && touched.confirmPassword
                          ? 'border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors duration-200 shadow-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Changing Password...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </motion.button>
                </div>
              </Form>
            )}
          </Formik>
        </motion.div>

        {/* Security Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6"
        >
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
            Password Security Tips
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
            <li>• Use a unique password you haven't used elsewhere</li>
            <li>• Include a mix of letters, numbers, and symbols</li>
            <li>• Avoid using personal information</li>
            <li>• Consider using a password manager</li>
          </ul>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mt-4"
        >
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300 mb-3">
            Account Settings
          </h3>
          <div className="space-y-2">
            <NavLink 
              to={
                currentProfile?.role === 'jobseeker' 
                  ? '/profile/job-seeker' 
                  : currentProfile?.role === 'employer' 
                  ? '/profile/employer' 
                  : '/profile/admin'
              }
              className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 no-underline"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Update Profile
            </NavLink>
            <NavLink 
              to={getDashboardPath(currentProfile?.role)}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 no-underline"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Dashboard
            </NavLink>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
