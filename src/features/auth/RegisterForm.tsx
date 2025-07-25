/**
 * Registration form component
 * Feature-based, modular registration form with email validation
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { motion, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { authFlowSession } from '../../utils/authFlowSession';

// Redux hooks
import { useAppSelector, useAppDispatch } from '../../hooks';
import { register, checkEmailExist, login } from './AuthSlice';

// Custom hooks
import { useFormValidation } from '../../hooks/useFormValidation';
import { usePasswordStrength } from '../../hooks/usePasswordStrength';
import { useEmailCheck } from '../../hooks/useEmailCheck';

// Components
import { ThemeToggle } from '../../components/ThemeToggle';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';
import { useLanguage } from '../../contexts/LanguageContext';
import { FormField } from '../../components/common/FormField/FormField';
import { PasswordStrengthIndicator } from '../../components/common/PasswordStrengthIndicator/PasswordStrengthIndicator';
import { EmailCheckStatus } from '../../components/common/EmailCheckStatus/EmailCheckStatus';

// Types, constants, and validation
import type { RegisterFormValues, NavigationState } from '../../types/auth.types';
import { registerValidationSchema } from '../../utils/validation.schemas';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, FORM_FIELDS } from '../../constants/auth.constants';

// Assets
import QuickworkLogo from '../../assets/Quickwork_logo.png';

// Constants for field names to prevent re-creation on each render
const REGISTRATION_FIELDS = [
  FORM_FIELDS.EMAIL,
  FORM_FIELDS.PASSWORD,
  FORM_FIELDS.CONFIRM_PASSWORD,
];

/**
 * Registration form component with modern UI and validation
 * @returns JSX element containing the registration form
 */
export default function RegisterForm(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { status, emailExists, emailCheckStatus } = useAppSelector((s) => s.auth);
  const { t } = useLanguage();
  const shouldReduceMotion = useReducedMotion() ?? false;
  const formRef = useRef<HTMLFormElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [emailChecked, setEmailChecked] = useState(false);

  // Get pre-filled email from navigation state
  const navigationState = location.state as NavigationState;
  const prefilledEmail = navigationState?.email || '';

  // Custom hooks
  const {
    fieldStates,
    globalErrors,
    setGlobalErrors,
    updateFieldStates,
    clearAllErrors,
  } = useFormValidation(REGISTRATION_FIELDS);

  const {
    strength: passwordStrength,
    strengthText,
    strengthColor,
    updatePassword,
    reset: resetPasswordStrength,
  } = usePasswordStrength();

  // Email checking hook
  const { debouncedCheckEmail, clearCheck } = useEmailCheck(500);

  // Parallax effect for right panel
  useEffect(() => {
    if (shouldReduceMotion) return;
    
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [shouldReduceMotion]);

  /**
   * Handle email existence check with debouncing
   * @param email - Email address to check
   */
  const handleEmailCheck = useCallback((email: string): void => {
    if (email && email.includes('@')) {
      debouncedCheckEmail(
        email,
        () => setEmailChecked(true), // onStart
        (_exists) => {
          // onComplete - _exists will be boolean or null
          // The exists parameter is handled by EmailCheckStatus component
          setEmailChecked(true);
        }
      );
    }
  }, [debouncedCheckEmail]);

  // Auto-check email when pre-filled
  useEffect(() => {
    if (prefilledEmail) {
      handleEmailCheck(prefilledEmail);
    }
  }, [prefilledEmail]);

  /**
   * Handle form submission with email existence validation
   * @param values - Form values
   * @param formikBag - Formik helper functions
   */
  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting, resetForm }: any
  ): Promise<void> => {
    clearAllErrors();
    
    try {
      // First, check if email exists (if not already checked)
      if (!emailChecked || emailCheckStatus !== 'succeeded') {
        await handleEmailCheck(values.email);
        
        // Wait for email check to complete
        const checkResult = await dispatch(checkEmailExist(values.email));
        if (checkEmailExist.fulfilled.match(checkResult) && checkResult.payload === true) {
          setGlobalErrors(['Email already exists. Please use a different email or sign in instead.']);
          setSubmitting(false);
          return;
        }
      }
      
      // If email exists, prevent registration
      if (emailExists === true) {
        setGlobalErrors(['Email already exists. Please use a different email or sign in instead.']);
        setSubmitting(false);
        return;
      }
      
      // Proceed with registration if email is available
      const registrationData = {
        email: values.email,
        password: values.password,
      };
      
      const res = await dispatch(register(registrationData));
      
      if (register.fulfilled.match(res)) {
        toast.success(SUCCESS_MESSAGES.REGISTER_SUCCESS);
        
        // Automatically log in the user after successful registration
        try {
          const loginData = {
            email: values.email,
            password: values.password,
          };
          
          const loginRes = await dispatch(login(loginData));
          
          if (login.fulfilled.match(loginRes)) {
            toast.success('Welcome to Quickwork! 🎉');
            
            // Clear auth flow session after successful registration and login
            authFlowSession.clearSession();
            
            // Navigate to role selection page after successful login
            navigate('/auth/choose-role', { replace: true });
          } else {
            // Registration succeeded but login failed - this is unusual but we'll handle it
            toast.error('Account created but login failed. Please try signing in manually.');
          }
        } catch (loginErr: any) {
          console.error('Auto-login failed:', loginErr);
          toast.error('Account created but auto-login failed. Please sign in manually.');
        }
        
        resetForm();
        resetPasswordStrength();
        setEmailChecked(false);
        clearCheck(); // Clear email check state
      } else {
        const errorMessage = res.payload || ERROR_MESSAGES.REGISTER_FAILED;
        setGlobalErrors([errorMessage]);
        toast.error('Registration failed ❌');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || ERROR_MESSAGES.REGISTER_FAILED;
      setGlobalErrors([errorMessage]);
      toast.error('Registration failed. Please try again. ❌');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col lg:flex-row bg-white dark:bg-zinc-900 transition-colors overflow-hidden">
      {/* Left side - Form (4/6 on desktop, full width on mobile) */}
      <div className="w-full lg:w-2/3 flex items-center justify-center p-3 lg:p-4 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md my-2 lg:my-4"
        >
          <div className="text-center mb-3 lg:mb-4">
            <div className="flex items-center justify-center mb-2 lg:mb-3">
              <div className="flex items-center space-x-2">
                <img 
                  src={QuickworkLogo} 
                  alt="Quickwork Logo" 
                  className="w-5 h-5 lg:w-7 lg:h-7 object-contain"
                />
                <span className="text-lg lg:text-xl font-bold text-zinc-800 dark:text-white">Quickwork</span>
              </div>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-zinc-800 dark:text-white mb-1">
              {t('auth.register.title')}
            </h1>
            <p className="text-xs lg:text-sm text-zinc-600 dark:text-zinc-400">{t('auth.register.subtitle')}</p>
          </div>

          {/* Registration Form */}
          <Formik
            initialValues={{ 
              email: prefilledEmail, 
              password: '', 
              confirmPassword: '', 
              agreeToTerms: false 
            }}
            validationSchema={registerValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, errors, touched, setFieldValue }) => {
              // Update field states and password strength
              useEffect(() => {
                updateFieldStates(values, errors, touched);
                if (values.password) {
                  updatePassword(values.password);
                }
              }, [values, errors, touched, updateFieldStates, updatePassword]);

              return (
                <Form ref={formRef} className="space-y-3 lg:space-y-4">
                  {/* Global Error Summary */}
                  {globalErrors.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ 
                        duration: shouldReduceMotion ? 0.1 : 0.3,
                        ease: 'easeOut'
                      }}
                      className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-lg"
                    >
                      <div className="flex items-start">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
                          className="flex-shrink-0 mt-0.5"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                            Registration Error
                          </h3>
                          <ul className="mt-1 text-sm text-red-700 dark:text-red-300 space-y-1">
                            {globalErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Email Field */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.4,
                      delay: shouldReduceMotion ? 0 : 0.1,
                      ease: 'easeOut'
                    }}
                  >
                    <FormField
                      name={FORM_FIELDS.EMAIL}
                      type="email"
                      label="Email Address"
                      placeholder="Enter your email address"
                      autoComplete="email"
                      disabled={isSubmitting || status === 'loading'}
                      fieldState={fieldStates[FORM_FIELDS.EMAIL]}
                      shouldReduceMotion={shouldReduceMotion}
                      onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                        const email = e.target.value;
                        if (email && email !== prefilledEmail && email.includes('@')) {
                          handleEmailCheck(email);
                        }
                      }}
                    />
                    
                    {/* Email Check Status */}
                    <EmailCheckStatus
                      status={emailCheckStatus}
                      emailExists={emailExists}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </motion.div>

                  {/* Password Fields Row */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.4,
                      delay: shouldReduceMotion ? 0 : 0.2,
                      ease: 'easeOut'
                    }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-3"
                  >
                    <div className="relative">
                      <FormField
                        name={FORM_FIELDS.PASSWORD}
                        type="password"
                        label="Password"
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        disabled={isSubmitting || status === 'loading'}
                        fieldState={fieldStates[FORM_FIELDS.PASSWORD]}
                        shouldReduceMotion={shouldReduceMotion}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setFieldValue('password', e.target.value);
                          updatePassword(e.target.value);
                        }}
                      />
                      
                      {/* Password Strength Indicator */}
                      {values.password && (
                        <PasswordStrengthIndicator
                          strength={passwordStrength}
                          strengthText={strengthText}
                          strengthColor={strengthColor}
                          shouldReduceMotion={shouldReduceMotion}
                        />
                      )}
                    </div>

                    <FormField
                      name={FORM_FIELDS.CONFIRM_PASSWORD}
                      type="password"
                      label="Confirm Password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      disabled={isSubmitting || status === 'loading'}
                      fieldState={fieldStates[FORM_FIELDS.CONFIRM_PASSWORD]}
                      shouldReduceMotion={shouldReduceMotion}
                    />
                  </motion.div>

                  {/* Terms and Conditions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.4,
                      delay: shouldReduceMotion ? 0 : 0.3,
                      ease: 'easeOut'
                    }}
                    className="flex items-start space-x-3"
                  >
                    <div className="flex items-center h-6 mt-0.5">
                      <Field
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        className="w-4 h-4 text-red-500 bg-gray-100 border-gray-300 rounded focus:ring-red-400 dark:focus:ring-red-500 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 transition-all duration-200"
                      />
                    </div>
                    <div className="text-sm">
                      <label htmlFor="agreeToTerms" className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        I agree to the{' '}
                        <motion.a 
                          href="#" 
                          className="text-red-500 dark:text-pink-400 hover:underline font-medium"
                          whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                          transition={{ duration: 0.1 }}
                        >
                          Terms and Conditions
                        </motion.a>
                        {' '}and{' '}
                        <motion.a 
                          href="#" 
                          className="text-red-500 dark:text-pink-400 hover:underline font-medium"
                          whileHover={{ scale: shouldReduceMotion ? 1 : 1.02 }}
                          transition={{ duration: 0.1 }}
                        >
                          Privacy Policy
                        </motion.a>
                      </label>
                      <ErrorMessage name="agreeToTerms">
                        {msg => (
                          <motion.div
                            initial={{ opacity: 0, y: -8, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -8, height: 0 }}
                            transition={{ duration: shouldReduceMotion ? 0.1 : 0.2 }}
                            className="text-red-500 text-sm mt-1 font-medium"
                          >
                            {msg}
                          </motion.div>
                        )}
                      </ErrorMessage>
                    </div>
                  </motion.div>
                
                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.4,
                      delay: shouldReduceMotion ? 0 : 0.4,
                      ease: 'easeOut'
                    }}
                  >
                    <motion.button
                      type="submit"
                      disabled={
                        isSubmitting || 
                        status === 'loading' || 
                        emailCheckStatus === 'loading' || 
                        emailExists === true
                      }
                      className="group relative w-full py-3 px-5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg overflow-hidden transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                      whileHover={shouldReduceMotion ? {} : { 
                        scale: 1.02,
                        boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)'
                      }}
                      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      
                      {/* Content */}
                      <div className="relative z-10 flex items-center justify-center">
                        {isSubmitting ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full mr-2"
                            />
                            Creating Account & Signing In...
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center"
                          >
                            <span>Create Account & Sign In</span>
                            <motion.svg
                              className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </motion.svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Divider */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.4,
                      delay: shouldReduceMotion ? 0 : 0.5,
                      ease: 'easeOut'
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-zinc-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white dark:bg-zinc-800 px-4 text-zinc-500 dark:text-zinc-400">or sign up with</span>
                    </div>
                  </motion.div>

                  {/* OAuth Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.4,
                      delay: shouldReduceMotion ? 0 : 0.6,
                      ease: 'easeOut'
                    }}
                    className="grid grid-cols-2 gap-3"
                  >
                    <motion.button
                      type="button"
                      disabled
                      className="group relative flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 cursor-not-allowed transition-all duration-200 overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-800 dark:bg-zinc-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800 dark:border-t-zinc-700"></div>
                        Coming Soon
                      </div>
                    </motion.button>
                    
                    <motion.button
                      type="button"
                      disabled
                      className="group relative flex items-center justify-center px-4 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-white dark:bg-zinc-800 text-zinc-400 cursor-not-allowed transition-all duration-200 overflow-hidden"
                      whileHover={shouldReduceMotion ? {} : { scale: 0.98 }}
                      transition={{ duration: 0.1 }}
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                      </svg>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-800 dark:bg-zinc-700 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap">
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-800 dark:border-t-zinc-700"></div>
                        Coming Soon
                      </div>
                    </motion.button>
                  </motion.div>
                
                  {/* Conditional Navigation Link - Compact */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: shouldReduceMotion ? 0.1 : 0.3,
                      delay: shouldReduceMotion ? 0 : 0.5,
                      ease: 'easeOut'
                    }}
                    className="text-center"
                  >
                    {emailCheckStatus === 'loading' ? (
                      <div className="flex items-center justify-center py-1">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full mr-1.5"
                        />
                        <span className="text-xs text-zinc-500 dark:text-zinc-500">Verifying...</span>
                      </div>
                    ) : emailChecked && emailExists ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 rounded-md"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium text-blue-700 dark:text-blue-300 mr-2">Account exists with this email.</span>
                          <Link 
                            to="/auth/login" 
                            state={{ email: values.email || prefilledEmail }}
                            className="inline-flex items-center text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                          >
                            <motion.span
                              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                            >
                              Sign in instead →
                            </motion.span>
                          </Link>
                        </div>
                      </motion.div>
                    ) : emailChecked && emailExists === false ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="px-3 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/50 rounded-md"
                      >
                        <div className="flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-500 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">Email available. You'll be automatically signed in after registration!</span>
                        </div>
                      </motion.div>
                    ) : (
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 py-1">
                        Already have an account?{' '}
                        <Link 
                          to="/auth/login" 
                          className="text-red-500 dark:text-pink-400 hover:underline font-medium"
                        >
                          <motion.span
                            whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                            transition={{ duration: 0.1 }}
                          >
                            Sign in
                          </motion.span>
                        </Link>
                      </p>
                    )}
                  </motion.div>
                </Form>
              );
            }}
          </Formik>
        </motion.div>
      </div>

      {/* Right side - Enhanced Image with Parallax (2/6 on desktop, hidden on mobile) */}
      <div className="hidden lg:block w-1/3 bg-gradient-to-br from-red-400 via-pink-400 to-orange-300 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: shouldReduceMotion ? 0 : scrollY * 0.1
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-br from-red-500/80 via-pink-500/80 to-orange-400/80"
          style={{
            transform: shouldReduceMotion ? 'none' : `translateY(${scrollY * 0.1}px)`
          }}
        />
        
        {/* Enhanced Floating sakura petals */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ 
                y: -60, 
                rotate: Math.random() * 360,
                opacity: 0.3 + Math.random() * 0.4
              }}
              animate={{ 
                y: '120vh', 
                rotate: 360 + Math.random() * 720,
                x: [
                  0, 
                  Math.random() * 40 - 20, 
                  Math.random() * 60 - 30,
                  Math.random() * 40 - 20,
                  0
                ],
                opacity: [
                  0.3 + Math.random() * 0.4,
                  0.6 + Math.random() * 0.3,
                  0.2 + Math.random() * 0.4,
                  0
                ]
              }}
              transition={{
                duration: 10 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: 'linear'
              }}
            >
              <svg 
                width={8 + Math.random() * 8} 
                height={8 + Math.random() * 8} 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-sm"
              >
                <path 
                  d="M16 2C17.5 7 22 10 28 10C23 13 22 18 24 24C20 21 16 22 12 24C14 18 13 13 8 10C14 10 14.5 7 16 2Z" 
                  fill={Math.random() > 0.5 ? "#fda4af" : "#fbb6ce"} 
                  fillOpacity={0.4 + Math.random() * 0.3}
                />
              </svg>
            </motion.div>
          ))}
        </div>
        
        {/* Background geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/20"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear'
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className="absolute inset-0 flex items-center justify-center p-8"
          style={{
            transform: shouldReduceMotion ? 'none' : `translateY(${scrollY * -0.05}px)`
          }}
        >
          <div className="text-center text-white relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-8"
            >
              <motion.h2 
                className="text-4xl font-bold mb-4 tracking-wide"
                animate={shouldReduceMotion ? {} : {
                  textShadow: [
                    '0 0 20px rgba(255,255,255,0.5)',
                    '0 0 30px rgba(255,255,255,0.3)',
                    '0 0 20px rgba(255,255,255,0.5)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                始まりの時
              </motion.h2>
              <p className="text-lg opacity-90 leading-relaxed max-w-sm mx-auto">
                Begin your journey with us. Where every new beginning blooms like sakura in spring.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative"
            >
              <motion.div
                className="w-48 h-48 mx-auto bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 shadow-2xl"
                animate={shouldReduceMotion ? {} : {
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    '0 20px 40px rgba(0,0,0,0.3)',
                    '0 25px 50px rgba(0,0,0,0.4)',
                    '0 20px 40px rgba(0,0,0,0.3)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                whileHover={shouldReduceMotion ? {} : { 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.svg 
                  width="80" 
                  height="80" 
                  viewBox="0 0 64 64" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="text-white drop-shadow-lg"
                  animate={shouldReduceMotion ? {} : { rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                >
                  <circle cx="32" cy="32" r="20" fill="currentColor" fillOpacity="0.3"/>
                  <path d="M32 4C35 14 44 20 56 20C46 26 44 36 48 48C40 42 32 44 24 48C28 36 26 26 16 20C28 20 29 14 32 4Z" fill="currentColor" fillOpacity="0.8"/>
                  <circle cx="32" cy="32" r="8" fill="currentColor" fillOpacity="0.9"/>
                </motion.svg>
              </motion.div>
              
              {/* Decorative rings */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white/20"
                animate={shouldReduceMotion ? {} : { rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute inset-4 rounded-full border border-white/30"
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </div>
        </motion.div>
      </div>

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
