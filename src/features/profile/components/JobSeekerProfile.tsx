import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useProfile } from '../hooks/useProfile';
import { useAvatarUpload } from '../../../hooks/useAvatarUpload';
import { ProfileHeader } from './ProfileHeader';
import toast from 'react-hot-toast';
import type { JobSeekerProfile, ProfileFormData } from '../types/profile.types';

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
  location: Yup.string()
    .max(100, 'Location must be less than 100 characters')
    .nullable(),
  professionalTitle: Yup.string()
    .max(100, 'Professional title must be less than 100 characters')
    .nullable(),
  bio: Yup.string()
    .max(1000, 'Bio must be less than 1000 characters')
    .nullable(),
  skills: Yup.array()
    .of(Yup.string())
    .max(20, 'Maximum of 20 skills allowed'),
  linkedinUrl: Yup.string()
    .url('Please enter a valid LinkedIn URL')
    .nullable(),
  portfolioUrl: Yup.string()
    .url('Please enter a valid portfolio URL')
    .nullable(),
});

const JobSeekerProfileComponent: React.FC = () => {
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
    location: '',
    address: '',
    professionalTitle: '',
    title: '',
    experience: '',
    skills: [],
    linkedinUrl: '',
    portfolioUrl: '',
    bio: '',
    summary: '',
    expectedSalary: undefined,
    jobType: undefined,
    availability: '',
  });

  const [newSkill, setNewSkill] = useState('');
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
    if (currentProfile && currentProfile.role === 'jobseeker') {
      const profile = currentProfile as JobSeekerProfile;
      
      // Convert legacy profile to new format
      const fullName = profile.firstName && profile.lastName 
        ? `${profile.firstName} ${profile.lastName}`.trim()
        : profile.firstName || '';
      
      const profileData: ProfileFormData = {
        fullName,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
        location: profile.location || '',
        address: profile.location || '',
        professionalTitle: profile.professionalTitle || '',
        title: profile.professionalTitle || '',
        experience: profile.experience || '',
        skills: profile.skills || [],
        linkedinUrl: profile.linkedinUrl || '',
        portfolioUrl: profile.portfolioUrl || '',
        bio: profile.bio || '',
        summary: profile.bio || '',
        expectedSalary: profile.expectedSalary,
        jobType: profile.jobType,
        availability: profile.availability || '',
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

  // Skill management functions that work with Formik
  const handleAddSkill = (values: ProfileFormData, setFieldValue: any) => {
    const trimmedSkill = newSkill.trim();
    
    // Validation checks
    if (!trimmedSkill) {
      toast.error('Please enter a skill name');
      return;
    }
    
    if (trimmedSkill.length < 2) {
      toast.error('Skill name must be at least 2 characters long');
      return;
    }
    
    if (trimmedSkill.length > 50) {
      toast.error('Skill name must be less than 50 characters');
      return;
    }
    
    if (values.skills?.includes(trimmedSkill)) {
      toast.error('This skill has already been added');
      return;
    }
    
    if (values.skills && values.skills.length >= 20) {
      toast.error('Maximum of 20 skills allowed');
      return;
    }
    
    // Add the skill
    const updatedSkills = [...(values.skills || []), trimmedSkill];
    setFieldValue('skills', updatedSkills);
    setNewSkill('');
    toast.success(`Added "${trimmedSkill}" to your skills`);
  };

  const handleRemoveSkill = (skillToRemove: string, values: ProfileFormData, setFieldValue: any) => {
    const updatedSkills = values.skills?.filter((skill: string) => skill !== skillToRemove) || [];
    setFieldValue('skills', updatedSkills);
    toast.success(`Removed "${skillToRemove}" from your skills`);
  };

  // Handle form submission
  const handleFormSubmit = async (values: ProfileFormData) => {
    try {
      console.log('JobSeekerProfile: Starting form submission...', { isNewProfile, values });
      
      // With HTTPOnly cookies, authentication is handled automatically by the browser
      // No need to check auth status here - let the API handle authentication
      
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

      console.log('JobSeekerProfile: Prepared profile data:', profileData);

      if (isNewProfile) {
        console.log('JobSeekerProfile: Creating new profile...');
        await createProfile({
          role: 'jobseeker',
          formData: profileData
        });
        toast.success('Profile created successfully! Welcome to your dashboard.');
        // Redirect to job seeker dashboard after successful profile creation
        setIsEditing(false);
        navigate('/dashboard');
      } else if (currentProfile) {
        console.log('JobSeekerProfile: Updating existing profile...');
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
      
      // Enhanced error handling with user-friendly messages
      if (error instanceof Error) {
        if (error.message.includes('403') || error.message.includes('Authentication')) {
          toast.error('Authentication failed. Please login again and try creating your profile.');
          // Redirect to login after showing error
          setTimeout(() => navigate('/auth'), 2000);
        } else if (error.message.includes('400')) {
          toast.error('Invalid profile data. Please check your information and try again.');
        } else if (error.message.includes('500')) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error(`Failed to save profile: ${error.message}`);
        }
      } else {
        toast.error('Failed to save profile. Please try again.');
      }
    }
  };

  // Handle form field changes with auto-sync
  const handleFieldChange = (field: string, value: any, setFieldValue: any, values: ProfileFormData) => {
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
      const [first, ...lastParts] = value.split(' ');
      setFieldValue('firstName', first || '');
      setFieldValue('lastName', lastParts.join(' ') || '');
    }
    
    // Sync related fields
    if (field === 'professionalTitle') {
      setFieldValue('title', value);
    } else if (field === 'title') {
      setFieldValue('professionalTitle', value);
    } else if (field === 'location') {
      setFieldValue('address', value);
    } else if (field === 'address') {
      setFieldValue('location', value);
    } else if (field === 'bio') {
      setFieldValue('summary', value);
    } else if (field === 'summary') {
      setFieldValue('bio', value);
    }
  };

  const handleCancel = (resetForm: any) => {
    if (isNewProfile) {
      navigate('/dashboard');
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
    // Default to job seeker dashboard since this is the JobSeekerProfile component
    return '/dashboard';
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
        title={isNewProfile ? "Create Your Job Seeker Profile" : "Job Seeker Profile"}
        subtitle={isNewProfile ? "Tell us about yourself to get started" : "Manage your professional information"}
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
              <div>
                <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                {error.includes('403') && (
                  <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                    This looks like an authentication issue. Please check your login status.
                  </p>
                )}
              </div>
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
                            <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                              {values.firstName ? values.firstName.charAt(0).toUpperCase() : '?'}
                            </div>
                          )}
                          
                          {isUploading && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="text-white text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                <p className="text-xs">{Math.round(progress)}%</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {isEditing && (
                          <button
                            type="button"
                            onClick={handleAvatarClick}
                            className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {values.firstName && values.lastName 
                            ? `${values.firstName} ${values.lastName}`
                            : 'Your Name'
                          }
                        </h3>
                        {values.professionalTitle && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {values.professionalTitle}
                          </p>
                        )}
                        {values.location && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 flex items-center justify-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {values.location}
                          </p>
                        )}
                      </div>

                      {isEditing && (avatarUrl || previewImage) && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="mt-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Profile Form Card */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="lg:col-span-2"
                >
                  <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Profile Information
                      </h2>
                      {!isNewProfile && !isEditing && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="space-y-8">
                        {/* Basic Information Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Basic Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                First Name *
                              </label>
                              <Field
                                name="firstName"
                                type="text"
                                disabled={!isEditing}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  handleFieldChange('firstName', e.target.value, setFieldValue, values)
                                }
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
                              />
                              {errors.firstName && touched.firstName && (
                                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Last Name *
                              </label>
                              <Field
                                name="lastName"
                                type="text"
                                disabled={!isEditing}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  handleFieldChange('lastName', e.target.value, setFieldValue, values)
                                }
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
                              />
                              {errors.lastName && touched.lastName && (
                                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Contact Information Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Contact Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Phone Number
                              </label>
                              <Field
                                name="phone"
                                type="tel"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
                                placeholder="+1 (555) 123-4567"
                              />
                              {errors.phone && touched.phone && (
                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Location
                              </label>
                              <Field
                                name="location"
                                type="text"
                                disabled={!isEditing}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  handleFieldChange('location', e.target.value, setFieldValue, values)
                                }
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
                                placeholder="City, State"
                              />
                              {errors.location && touched.location && (
                                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Professional Information Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Professional Information
                          </h3>
                          <div className="space-y-6">
                            <div>
                              <label htmlFor="professionalTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Professional Title
                              </label>
                              <Field
                                name="professionalTitle"
                                type="text"
                                disabled={!isEditing}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  handleFieldChange('professionalTitle', e.target.value, setFieldValue, values)
                                }
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
                                placeholder="e.g. Senior Software Engineer"
                              />
                              {errors.professionalTitle && touched.professionalTitle && (
                                <p className="mt-1 text-sm text-red-600">{errors.professionalTitle}</p>
                              )}
                            </div>

                            <div>
                              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Bio
                              </label>
                              <Field
                                name="bio"
                                as="textarea"
                                disabled={!isEditing}
                                rows={4}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                                  handleFieldChange('bio', e.target.value, setFieldValue, values)
                                }
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors resize-none"
                                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                              />
                              {errors.bio && touched.bio && (
                                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                              )}
                            </div>

                            {/* Skills Section */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Skills & Expertise
                              </label>
                              
                              {/* Add Skill Input - Always visible when editing */}
                              {isEditing && (
                                <div className="mb-4">
                                  <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                      <input
                                        type="text"
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a new skill (e.g., JavaScript, React, Node.js)"
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors pr-12"
                                        onKeyPress={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddSkill(values, setFieldValue);
                                          }
                                        }}
                                      />
                                      {newSkill && (
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                          <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-400 dark:border-gray-500">
                                            Enter
                                          </kbd>
                                        </div>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleAddSkill(values, setFieldValue)}
                                      disabled={!newSkill.trim()}
                                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg font-medium disabled:transform-none disabled:cursor-not-allowed"
                                    >
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                      </svg>
                                    </button>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Press Enter or click the + button to add a skill. Add technologies, programming languages, frameworks, and tools you're proficient in.
                                  </p>
                                </div>
                              )}

                              {/* Skills Display */}
                              <div className="space-y-3">
                                {values.skills && values.skills.length > 0 ? (
                                  <>
                                    <div className="flex flex-wrap gap-2">
                                      {values.skills.map((skill: string, index: number) => (
                                        <motion.div
                                          key={index}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          exit={{ opacity: 0, scale: 0.8 }}
                                          className="group relative"
                                        >
                                          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200">
                                            <svg className="w-3 h-3 mr-2 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z" clipRule="evenodd" />
                                              <path fillRule="evenodd" d="M13.854 8.354a.5.5 0 0 0-.708-.708L10 10.793 8.854 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3.5-3.5z" clipRule="evenodd" />
                                            </svg>
                                            {skill}
                                            {isEditing && (
                                              <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill, values, setFieldValue)}
                                                className="ml-2 text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 font-bold text-lg leading-none transition-colors opacity-0 group-hover:opacity-100"
                                                title="Remove skill"
                                              >
                                                ×
                                              </button>
                                            )}
                                          </span>
                                        </motion.div>
                                      ))}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                                      <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">
                                          {values.skills.length} skill{values.skills.length !== 1 ? 's' : ''} added
                                        </span>
                                      </div>
                                      {isEditing && (
                                        <p className="mt-1 text-xs">
                                          Hover over skills to remove them. Skills help employers find candidates with the right expertise.
                                        </p>
                                      )}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <p className="text-gray-500 dark:text-gray-400 font-medium">
                                      {isEditing ? "Add your first skill above" : "No skills added yet"}
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                      {isEditing 
                                        ? "Start building your skill profile to attract the right opportunities"
                                        : "Skills will be displayed here once added"
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Skill Suggestions (when editing and no skills added yet) */}
                              {isEditing && (!values.skills || values.skills.length === 0) && (
                                <div className="mt-4">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Popular Skills:
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'HTML/CSS', 'Git', 'MongoDB'].map((suggestedSkill) => (
                                      <button
                                        key={suggestedSkill}
                                        type="button"
                                        onClick={() => {
                                          setNewSkill(suggestedSkill);
                                          setTimeout(() => handleAddSkill(values, setFieldValue), 100);
                                        }}
                                        className="px-3 py-1 text-xs bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                      >
                                        + {suggestedSkill}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Additional Information Section */}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Additional Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                LinkedIn URL
                              </label>
                              <Field
                                name="linkedinUrl"
                                type="url"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
                                placeholder="https://linkedin.com/in/yourprofile"
                              />
                              {errors.linkedinUrl && touched.linkedinUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl}</p>
                              )}
                            </div>
                            
                            <div>
                              <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Portfolio URL
                              </label>
                              <Field
                                name="portfolioUrl"
                                type="url"
                                disabled={!isEditing}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-colors"
                                placeholder="https://yourportfolio.com"
                              />
                              {errors.portfolioUrl && touched.portfolioUrl && (
                                <p className="mt-1 text-sm text-red-600">{errors.portfolioUrl}</p>
                              )}
                            </div>
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
                              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white rounded-lg transition-all transform hover:scale-105 shadow-lg font-medium disabled:transform-none"
                            >
                              {isCreating || isUpdating || isSubmitting ? (
                                <div className="flex items-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </div>
                              ) : (
                                'Save Profile'
                              )}
                            </button>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Hidden file input for avatar upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
    </div>
  );
};

export default JobSeekerProfileComponent;
