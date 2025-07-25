import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { motion, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { login } from './AuthSlice';
// TODO: Re-import when profile module is rebuilt
// import { fetchCurrentProfile } from '../profile/ProfileSlice';
import { ThemeToggle } from '../../components/ThemeToggle';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';
import QuickworkLogo from '../../assets/Quickwork_logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { authFlowSession } from '../../utils/authFlowSession';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion();

  // Get pre-filled email from navigation state
  const prefilledEmail = location.state?.email || '';

  const schema = Yup.object({
    email: Yup.string().email(t('validation.email.invalid')).required(t('validation.email.required')),
    password: Yup.string().min(6, t('validation.password.min')).required(t('validation.password.required')),
  });

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-white dark:bg-zinc-900 transition-colors overflow-hidden">
      {/* Left side - Form (2/3 on desktop, full width on mobile) */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-2 lg:p-6 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900">
        <motion.div
          className="w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: shouldReduceMotion ? 0 : 0.6,
            staggerChildren: shouldReduceMotion ? 0 : 0.1,
            delayChildren: shouldReduceMotion ? 0 : 0.2
          }}
        >
          <motion.div 
            className="text-center mb-3 lg:mb-4"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: shouldReduceMotion ? 0 : 0.5 }}
          >
            <motion.div 
              className="flex items-center justify-center mb-2 lg:mb-3"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              <div className="flex items-center space-x-2">
                <motion.img 
                  src={QuickworkLogo} 
                  alt="Quickwork" 
                  className="w-5 h-5 lg:w-6 lg:h-6 rounded-lg shadow-md object-contain"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="text-lg lg:text-xl font-bold text-zinc-800 dark:text-white">Quickwork</span>
              </div>
            </motion.div>
            <motion.h1 
              className="text-xl lg:text-2xl font-bold text-zinc-800 dark:text-white mb-1"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              {t('auth.login.title')}
            </motion.h1>
            <motion.p 
              className="text-zinc-600 dark:text-zinc-400 text-xs lg:text-sm"
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              {t('auth.login.subtitle')}
            </motion.p>
          </motion.div>

          <Formik
            initialValues={{ email: prefilledEmail, password: '' }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              const res = await dispatch(login(values));
              if (login.fulfilled.match(res)) {
                toast.success(t('auth.login.success'));
                resetForm();
                
                // Clear auth flow session after successful login
                authFlowSession.clearSession();
                
                console.log('LoginForm: Login successful, navigating to SmartRedirect...');
                // Redirect to home page, SmartRedirect will handle profile checking
                navigate('/', { replace: true });
              } else {
                toast.error(res.payload || t('auth.login.error'));
              }
              setSubmitting(false);
            }}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form className="space-y-2 lg:space-y-3">
                {/* Global validation summary */}
                {Object.keys(errors).length > 0 && Object.keys(touched).length > 0 && (
                  <motion.div 
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-start">
                      <svg className="w-4 h-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-xs lg:text-sm font-medium text-red-800 dark:text-red-200">{t('auth.login.errorFixMessage')}</h4>
                        <ul className="mt-1 text-xs text-red-700 dark:text-red-300 list-disc list-inside">
                          {errors.email && touched.email && <li>{errors.email as string}</li>}
                          {errors.password && touched.password && <li>{errors.password}</li>}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-2 lg:space-y-2.5">
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: shouldReduceMotion ? 0 : 0.5 }}
                  >
                    <label htmlFor="email" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('auth.login.email')}
                    </label>
                    <Field name="email">
                      {({ field, meta }: any) => (
                        <div className="relative">
                          <motion.input
                            {...field}
                            id="email"
                            type="email"
                            autoComplete="username"
                            placeholder={t('auth.login.emailPlaceholder')}
                            className={`w-full px-2.5 py-2 text-xs lg:text-sm border-2 rounded-lg focus:ring-2 outline-none bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white transition-all duration-300 ${
                              meta.touched && meta.error
                                ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10'
                                : meta.touched && !meta.error
                                ? 'border-green-500 dark:border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50 dark:bg-green-900/10'
                                : 'border-gray-300 dark:border-zinc-600 focus:border-red-400 dark:focus:border-pink-400 focus:ring-red-400/20'
                            }`}
                            disabled={isSubmitting || status === 'loading'}
                            whileFocus={shouldReduceMotion ? {} : { 
                              scale: 1.01,
                              boxShadow: meta.touched && meta.error 
                                ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                                : meta.touched && !meta.error
                                ? "0 0 0 3px rgba(34, 197, 94, 0.1)"
                                : "0 0 0 3px rgba(239, 68, 68, 0.1)"
                            }}
                            transition={{ duration: 0.2 }}
                          />
                          {/* Success checkmark */}
                          {meta.touched && !meta.error && field.value && (
                            <motion.div
                              className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          )}
                          {/* Error icon */}
                          {meta.touched && meta.error && (
                            <motion.div
                              className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </Field>
                    {/* Enhanced error message */}
                    <ErrorMessage name="email">
                      {msg => (
                        <motion.div 
                          className="flex items-center mt-1.5 text-red-500 text-xs"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <svg className="w-3 h-3 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {msg}
                        </motion.div>
                      )}
                    </ErrorMessage>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: shouldReduceMotion ? 0 : 0.5 }}
                  >
                    <label htmlFor="password" className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      {t('auth.login.password')}
                    </label>
                    <Field name="password">
                      {({ field, meta }: any) => (
                        <div className="relative">
                          <motion.input
                            {...field}
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder={t('auth.login.passwordPlaceholder')}
                            className={`w-full px-2.5 py-2 text-xs lg:text-sm border-2 rounded-lg focus:ring-2 outline-none bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white transition-all duration-300 ${
                              meta.touched && meta.error
                                ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/10'
                                : meta.touched && !meta.error && field.value
                                ? 'border-green-500 dark:border-green-500 focus:border-green-500 focus:ring-green-500/20 bg-green-50 dark:bg-green-900/10'
                                : 'border-gray-300 dark:border-zinc-600 focus:border-red-400 dark:focus:border-pink-400 focus:ring-red-400/20'
                            }`}
                            disabled={isSubmitting || status === 'loading'}
                            whileFocus={shouldReduceMotion ? {} : { 
                              scale: 1.02,
                              boxShadow: meta.touched && meta.error 
                                ? "0 0 0 3px rgba(239, 68, 68, 0.1)"
                                : meta.touched && !meta.error && field.value
                                ? "0 0 0 3px rgba(34, 197, 94, 0.1)"
                                : "0 0 0 3px rgba(239, 68, 68, 0.1)"
                            }}
                            transition={{ duration: 0.2 }}
                          />
                          {/* Password strength indicator */}
                          {field.value && (
                            <div className="absolute right-2.5 top-1/2 transform -translate-y-1/2 flex space-x-1">
                              {meta.touched && !meta.error ? (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                              ) : meta.touched && meta.error ? (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </motion.div>
                              ) : (
                                <div className="flex space-x-1">
                                  {/* Password strength dots */}
                                  {[...Array(3)].map((_, i) => (
                                    <motion.div
                                      key={i}
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        field.value.length > (i + 1) * 2
                                          ? field.value.length >= 8 
                                            ? 'bg-green-500' 
                                            : field.value.length >= 6 
                                            ? 'bg-yellow-500' 
                                            : 'bg-red-500'
                                          : 'bg-gray-300 dark:bg-gray-600'
                                      }`}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ delay: i * 0.1 }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Field>
                    {/* Enhanced error message with password requirements */}
                    <ErrorMessage name="password">
                      {msg => (
                        <motion.div 
                          className="mt-2"
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center text-red-500 text-xs lg:text-sm mb-2">
                            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {msg}
                          </div>
                        </motion.div>
                      )}
                    </ErrorMessage>
                    {/* Password requirements helper */}
                    <Field name="password">
                      {({ field }: any) => field.value && field.value.length > 0 && field.value.length < 6 && (
                        <motion.div 
                          className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Password requirements:</p>
                          <div className="flex items-center text-xs">
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${field.value.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                            <span className={field.value.length >= 6 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}>
                              At least 6 characters
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </Field>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: shouldReduceMotion ? 0 : 0.5 }}
                >
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-3 h-3 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-400 dark:focus:ring-red-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="ml-1.5 text-xs text-zinc-600 dark:text-zinc-400">Remember me</span>
                  </label>
                  <a href="#" className="text-xs text-red-500 dark:text-pink-400 hover:underline">
                    {t('auth.login.forgotPassword')}
                  </a>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: shouldReduceMotion ? 0 : 0.5 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || status === 'loading' || Object.keys(errors).length > 0}
                    className={`w-full py-2 px-4 font-semibold rounded-lg shadow-lg transition-all duration-300 text-xs lg:text-sm ${
                      Object.keys(errors).length > 0
                        ? 'bg-gray-400 dark:bg-gray-600 text-gray-300 dark:text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white hover:shadow-xl'
                    } ${(isSubmitting || status === 'loading') ? 'opacity-50 cursor-not-allowed' : ''}`}
                    whileHover={shouldReduceMotion || Object.keys(errors).length > 0 ? {} : { scale: 1.05 }}
                    whileTap={shouldReduceMotion || Object.keys(errors).length > 0 ? {} : { scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {status === 'loading' ? (
                      <div className="flex items-center justify-center">
                        <motion.div
                          className="w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                        Signing in...
                      </div>
                    ) : Object.keys(errors).length > 0 ? (
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('auth.login.button')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t('auth.login.button')}
                      </div>
                    )}
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="relative"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: shouldReduceMotion ? 0 : 0.5 }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                  </div>
                  <div className="relative flex justify-center text-xs lg:text-sm">
                    <span className="bg-white dark:bg-zinc-800 px-4 text-zinc-500 dark:text-zinc-400">or continue with</span>
                  </div>
                </motion.div>

                {/* OAuth Buttons */}
                <motion.div 
                  className="grid grid-cols-2 gap-2 lg:gap-3"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: shouldReduceMotion ? 0 : 0.5 }}
                >
                  <motion.button
                    type="button"
                    disabled
                    className="flex items-center justify-center px-2 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-400 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors relative group"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Coming Soon</span>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    disabled
                    className="flex items-center justify-center px-2 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-zinc-400 cursor-not-allowed hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors relative group"
                    whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Coming Soon</span>
                  </motion.button>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: shouldReduceMotion ? 0 : 0.5 }}
                >
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    {t('auth.login.noAccount')}{' '}
                    <a href="/auth/register" className="text-red-500 dark:text-pink-400 hover:underline font-medium">
                      {t('auth.login.signUp')}
                    </a>
                  </p>
                </motion.div>
                
                {error && (
                  <motion.div 
                    className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">Authentication Error</h4>
                        <p className="text-xs text-red-700 dark:text-red-300 mt-1">{error}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>

      {/* Right side - Enhanced Parallax Panel (1/3 on desktop, hidden on mobile) */}
      <motion.div 
        className="hidden lg:block w-1/3 bg-gradient-to-br from-red-400 via-pink-400 to-orange-300 relative overflow-hidden"
        animate={shouldReduceMotion ? {} : {
          y: [-5, 5, -5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-br from-red-500/80 via-pink-500/80 to-orange-400/80"
        />
        <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-12">
          <div className="text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-4xl font-bold mb-4">Welcome Back!</h2>
              <p className="text-xl opacity-90">Your productivity journey continues here</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-64 h-64 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05, rotate: 5 }}
            >
              <motion.svg 
                width="120" 
                height="120" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                className="text-white"
                animate={shouldReduceMotion ? {} : { rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <path d="M9 11H7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-2"/>
                <path d="M9 7h6l-3-4-3 4"/>
                <path d="M12 11v6"/>
              </motion.svg>
            </motion.div>
            
            {/* Enhanced decorative elements */}
            <motion.div 
              className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
              animate={shouldReduceMotion ? {} : { 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"
              animate={shouldReduceMotion ? {} : { 
                scale: [1.2, 1, 1.2],
                opacity: [0.6, 0.3, 0.6]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"
              animate={shouldReduceMotion ? {} : { 
                y: [-10, 10, -10],
                x: [-5, 5, -5]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>

      <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
        <motion.button
          onClick={() => navigate('/auth/before')}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-white dark:hover:bg-zinc-800 transition-all duration-200 shadow-sm hover:shadow-md"
          whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: shouldReduceMotion ? 0 : 0.3 }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{t('auth.back')}</span>
        </motion.button>
      </div>

      <div className="absolute top-4 right-4 lg:top-6 lg:right-6 flex items-center space-x-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </div>
  );
}