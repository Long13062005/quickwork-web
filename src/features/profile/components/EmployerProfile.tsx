import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useProfile } from '../hooks/useProfile';
import { useAvatarUpload } from '../../../hooks/useAvatarUpload';
import { ProfileHeader } from './ProfileHeader';
import toast from 'react-hot-toast';
import type { EmployerProfile, ProfileFormData } from '../types/profile.types';

// Validation Schema
const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .required('First name is required'),
  lastName: Yup.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .required('Last name is required'),
  phone: Yup.string()
    .matches(/^[+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .nullable(),
  companyLocation: Yup.string()
    .max(100, 'Company location must be less than 100 characters')
    .nullable(),
  companyName: Yup.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be less than 100 characters')
    .required('Company name is required'),
  industry: Yup.string()
    .min(2, 'Industry must be at least 2 characters')
    .max(100, 'Industry must be less than 100 characters')
    .required('Industry is required'),
  companySize: Yup.string()
    .nullable(),
  companyDescription: Yup.string()
    .max(1000, 'Company description must be less than 1000 characters')
    .nullable(),
  companyWebsite: Yup.string()
    .url('Please enter a valid website URL')
    .nullable(),
  linkedinUrl: Yup.string()
    .url('Please enter a valid LinkedIn URL')
    .nullable(),
});

const EmployerProfileComponent: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    currentProfile, 
    loading, 
    error, 
    isCreating, 
    isUpdating,
    createProfile, 
    updateProfile,
    fetchMyProfile 
  } = useProfile();

  // For now, use a placeholder user ID until we can get it from auth
  const userId = currentProfile?.userId || 'user-' + Date.now();

  const {
    isUploading,
    progress,
    uploadAvatar,
    deleteAvatar,
    validateFile
  } = useAvatarUpload({
    userId,
    onSuccess: (result) => {
      setAvatarUrl(result.url);
      setPreviewImage('');
      toast.success('Avatar uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error);
      setPreviewImage('');
    }
  });
  
  // Initial form values
  const getInitialValues = (): ProfileFormData => ({
    fullName: '',
    firstName: '',
    lastName: '',
    phone: '',
    companyLocation: '',
    address: '',
    companyName: '',
    companySize: undefined,
    industry: '',
    companyDescription: '',
    summary: '',
    companyWebsite: '',
    linkedinUrl: '',
    avatarUrl: '',
    profilePicture: '',
  });

  const [isEditing, setIsEditing] = useState(true); // Start in editing mode for new profiles
  const [profileCheckDone, setProfileCheckDone] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [initialValues, setInitialValues] = useState<ProfileFormData>(getInitialValues());

  // Check if this is an existing profile or new one
  const isNewProfile = !currentProfile;
  
  // Set editing mode for new profiles
  useEffect(() => {
    console.log('Profile status:', { isNewProfile, profileCheckDone, currentProfile: !!currentProfile, isEditing });
    if (isNewProfile && profileCheckDone) {
      setIsEditing(true);
    }
  }, [isNewProfile, profileCheckDone]);
  
  useEffect(() => {
    // Only fetch profile once when component mounts and we haven't checked yet
    if (!profileCheckDone && !currentProfile && !loading) {
      setProfileCheckDone(true); // Prevent future calls
      fetchMyProfile().catch(() => {
        // Profile doesn't exist yet, that's okay for new users
        setIsEditing(true);
      });
    }
  }, [profileCheckDone, currentProfile, loading, fetchMyProfile]);

  useEffect(() => {
    if (currentProfile && currentProfile.role === 'employer') {
      const profile = currentProfile as EmployerProfile;
      
      // Convert legacy profile to new format
      const fullName = profile.firstName && profile.lastName 
        ? `${profile.firstName} ${profile.lastName}`.trim()
        : profile.firstName || '';
      
      const profileData: ProfileFormData = {
        fullName,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        companyLocation: profile.companyLocation || '',
        address: profile.companyLocation || '',
        companyName: profile.companyName || '',
        companySize: profile.companySize,
        industry: profile.industry || '',
        companyDescription: profile.companyDescription || '',
        summary: profile.companyDescription || '',
        companyWebsite: profile.companyWebsite || '',
        linkedinUrl: profile.linkedinUrl || '',
        avatarUrl: profile.profilePicture || '',
        profilePicture: profile.profilePicture || '',
      };
      
      setInitialValues(profileData);
      setIsEditing(false); // Turn off editing mode when profile is loaded
      
      // Set avatar URL from profile if available
      if (profile.profilePicture) {
        setAvatarUrl(profile.profilePicture);
      }
    }
  }, [currentProfile]);

  // Avatar upload handlers
  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase
    try {
      await uploadAvatar(file);
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  const handleRemoveAvatar = async () => {
    if (avatarUrl && currentProfile?.profilePicture) {
      try {
        // Extract path from Firebase URL for deletion
        const pathMatch = currentProfile.profilePicture.match(/avatars%2F[^?]+/);
        if (pathMatch) {
          const storagePath = decodeURIComponent(pathMatch[0]);
          await deleteAvatar(storagePath);
          setAvatarUrl('');
          toast.success('Avatar removed successfully!');
        }
      } catch (error) {
        console.error('Failed to remove avatar:', error);
        toast.error('Failed to remove avatar');
      }
    } else {
      setAvatarUrl('');
      setPreviewImage('');
    }
  };

  // Handle form field changes with auto-sync
  const handleFieldChange = (field: string, value: unknown, setFieldValue: (field: string, value: unknown) => void, values: ProfileFormData) => {
    setFieldValue(field, value);
    
    // Auto-update fullName when firstName or lastName changes
    if (field === 'firstName' || field === 'lastName') {
      const firstName = field === 'firstName' ? value : values.firstName || '';
      const lastName = field === 'lastName' ? value : values.lastName || '';
      const fullName = firstName && lastName ? `${firstName} ${lastName}`.trim() : firstName || lastName || '';
      setFieldValue('fullName', fullName);
    }
    
    // Auto-update firstName/lastName when fullName changes
    if (field === 'fullName') {
      const fullNameStr = typeof value === 'string' ? value : '';
      const [first, ...lastParts] = fullNameStr.split(' ');
      setFieldValue('firstName', first || '');
      setFieldValue('lastName', lastParts.join(' ') || '');
    }
    
    // Sync related fields
    if (field === 'companyLocation') {
      setFieldValue('address', value);
    } else if (field === 'address') {
      setFieldValue('companyLocation', value);
    } else if (field === 'companyDescription') {
      setFieldValue('summary', value);
    } else if (field === 'summary') {
      setFieldValue('companyDescription', value);
    }
  };

  const handleCancel = (resetForm: () => void) => {
    if (isNewProfile) {
      navigate('/employer/dashboard');
    } else {
      setIsEditing(false);
      // Reset form to initial values
      resetForm();
    }
  };

  // Function to get dashboard path based on user role
  const getDashboardPath = () => {
    if (currentProfile?.role === 'jobseeker') {
      return '/dashboard';
    } else if (currentProfile?.role === 'employer') {
      return '/employer/dashboard';
    } else if (currentProfile?.role === 'admin') {
      return '/admin/dashboard';
    }
    // Default to employer dashboard since this is the EmployerProfile component
    return '/employer/dashboard';
  };

  // Handle form submission
  const handleFormSubmit = async (values: ProfileFormData) => {
    try {
      // Prepare profile data with avatar URL
      const profileData = {
        ...values,
        avatarUrl: avatarUrl || values.avatarUrl || values.profilePicture,
        profilePicture: avatarUrl || values.avatarUrl || values.profilePicture,
        // Ensure fullName is properly set
        fullName: values.fullName || (values.firstName && values.lastName 
          ? `${values.firstName} ${values.lastName}`.trim() 
          : values.firstName || ''),
      };

      if (isNewProfile) {
        console.log('EmployerProfile: Creating new employer profile (role=employer, profileType=EMPLOYER)...');
        await createProfile({
          role: 'employer',
          formData: profileData
        });
        toast.success('Company profile created successfully! Welcome to your dashboard.');
        // Redirect to employer dashboard after successful profile creation
        setIsEditing(false);
        navigate('/employer/dashboard');
      } else if (currentProfile) {
        console.log('EmployerProfile: Updating existing profile (role=employer, profileType=EMPLOYER)...');
        await updateProfile({
          profileId: currentProfile.id,
          formData: profileData
        });
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        // Stay on profile page after update, or navigate based on context
        // navigate('/profile/success');
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <ProfileHeader 
        title={isNewProfile ? "Create Your Employer Profile" : "Employer Profile"}
        subtitle={isNewProfile ? "Tell us about your company to get started" : "Manage your company information"}
      />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={() => navigate(getDashboardPath())}
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </motion.div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, setFieldValue, resetForm, handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Avatar Card */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-1"
                >
                  <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div 
                          className={`relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg ${
                            isEditing ? 'cursor-pointer hover:shadow-xl transition-shadow' : ''
                          }`}
                          onClick={handleAvatarClick}
                        >
                          {previewImage || avatarUrl ? (
                            <img 
                              src={previewImage || avatarUrl} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                              {values.firstName ? values.firstName.charAt(0).toUpperCase() : 'E'}
                            </div>
                          )}
                          {isEditing && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                          </div>
                        )}
                        
                        {isEditing && (avatarUrl || previewImage) && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAvatar();
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {values.fullName || values.firstName || 'Company Representative'}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {values.companyName || 'Company'}
                        </p>
                        {values.industry && (
                          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {values.industry}
                          </p>
                        )}
                      </div>
                      
                      {progress > 0 && progress < 100 && (
                        <div className="mt-4">
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Uploading... {Math.round(progress)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Form Fields */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Company Information
                      </h2>
                      {!isNewProfile && !isEditing && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First Name *
                          </label>
                          <Field
                            name="firstName"
                            type="text"
                            disabled={!isEditing}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleFieldChange('firstName', e.target.value, setFieldValue, values)
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.firstName && touched.firstName
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.firstName && touched.firstName && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.firstName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Last Name *
                          </label>
                          <Field
                            name="lastName"
                            type="text"
                            disabled={!isEditing}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleFieldChange('lastName', e.target.value, setFieldValue, values)
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.lastName && touched.lastName
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.lastName && touched.lastName && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone
                          </label>
                          <Field
                            name="phone"
                            type="tel"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.phone && touched.phone
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.phone && touched.phone && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Location
                          </label>
                          <Field
                            name="companyLocation"
                            type="text"
                            disabled={!isEditing}
                            placeholder="City, State"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              handleFieldChange('companyLocation', e.target.value, setFieldValue, values)
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.companyLocation && touched.companyLocation
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.companyLocation && touched.companyLocation && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyLocation}</p>
                          )}
                        </div>
                      </div>

                      {/* Company Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company Name *
                          </label>
                          <Field
                            name="companyName"
                            type="text"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.companyName && touched.companyName
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.companyName && touched.companyName && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyName}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Industry *
                          </label>
                          <Field
                            name="industry"
                            type="text"
                            disabled={!isEditing}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.industry && touched.industry
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.industry && touched.industry && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.industry}</p>
                          )}
                        </div>
                      </div>

                      {/* Company Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Size
                        </label>
                        <Field
                          as="select"
                          name="companySize"
                          disabled={!isEditing}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                            !isEditing 
                              ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          <option value="">Select company size</option>
                          <option value="1-10">1-10 employees</option>
                          <option value="11-50">11-50 employees</option>
                          <option value="51-200">51-200 employees</option>
                          <option value="201-500">201-500 employees</option>
                          <option value="501-1000">501-1000 employees</option>
                          <option value="1000+">1000+ employees</option>
                        </Field>
                      </div>

                      {/* Company Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Company Description
                        </label>
                        <Field
                          as="textarea"
                          name="companyDescription"
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Tell us about your company..."
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                            handleFieldChange('companyDescription', e.target.value, setFieldValue, values)
                          }
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-vertical ${
                            !isEditing 
                              ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                              : errors.companyDescription && touched.companyDescription
                                ? 'border-red-300 dark:border-red-600'
                                : 'border-gray-300 dark:border-gray-600'
                          }`}
                        />
                        {errors.companyDescription && touched.companyDescription && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyDescription}</p>
                        )}
                      </div>

                      {/* Contact Information */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Website
                          </label>
                          <Field
                            name="companyWebsite"
                            type="url"
                            disabled={!isEditing}
                            placeholder="https://example.com"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.companyWebsite && touched.companyWebsite
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.companyWebsite && touched.companyWebsite && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.companyWebsite}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            LinkedIn URL
                          </label>
                          <Field
                            name="linkedinUrl"
                            type="url"
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/company/..."
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${
                              !isEditing 
                                ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600' 
                                : errors.linkedinUrl && touched.linkedinUrl
                                  ? 'border-red-300 dark:border-red-600'
                                  : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.linkedinUrl && touched.linkedinUrl && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.linkedinUrl}</p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {isEditing && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                        >
                          <button
                            type="button"
                            onClick={() => handleCancel(resetForm)}
                            className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isCreating || isUpdating || isSubmitting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-medium flex items-center space-x-2"
                          >
                            {(isCreating || isUpdating || isSubmitting) && (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            )}
                            <span>{isCreating || isUpdating || isSubmitting ? 'Saving...' : 'Save Profile'}</span>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EmployerProfileComponent;