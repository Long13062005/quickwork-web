/**
 * AdminProfile Component
 * Allows administrators to edit their profile information
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';

import { useProfile } from '../hooks/useProfile';
import { AvatarUpload } from '../../../components/AvatarUpload';
import { PageLoader } from '../../../components/PageLoader';

// Validation schema for admin profile form
const AdminProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  phone: Yup.string(),
  location: Yup.string(),
  title: Yup.string(),
  bio: Yup.string(),
});

const AdminProfile: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfile,
    loading,
    fetchMyProfile,
    createProfile,
    updateProfile,
    hasProfile,
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Function to get dashboard path based on user role
  const getDashboardPath = () => {
    if (currentProfile?.role === 'jobseeker') {
      return '/dashboard';
    } else if (currentProfile?.role === 'employer') {
      return '/employer/dashboard';
    } else if (currentProfile?.role === 'admin') {
      return '/admin/dashboard';
    }
    // Default to admin dashboard since this is the AdminProfile component
    return '/admin/dashboard';
  };

  // On mount, fetch the current profile
  useEffect(() => {
    fetchMyProfile();
  }, [fetchMyProfile]);

  // When the profile loads, determine if we're creating or editing
  useEffect(() => {
    // If no profile exists, enable editing mode by default
    if (!loading && !hasProfile) {
      setIsEditing(true);
    }

    // Set the avatar URL if the profile has one
    if (currentProfile?.profilePicture) {
      setAvatarUrl(currentProfile.profilePicture);
    }
  }, [currentProfile, hasProfile, loading]);

  // We're not using handleAvatarComplete directly since we're using the AvatarUpload's built-in callbacks
  
  // Safely access properties that may not be in the type definition
  const getProfileValue = (key: string, fallback: string = 'Not specified'): string => {
    if (!currentProfile) return fallback;
    return (currentProfile as any)[key] || fallback;
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    
    try {
      const profileData = {
        ...values,
        avatarUrl: avatarUrl,
      };

      const isNewProfile = !currentProfile?.id;
      
      // If creating a new profile
      if (isNewProfile) {
        console.log('AdminProfile: Creating new profile...');
        await createProfile({
          role: 'admin',
          formData: {
            ...profileData,
            // Ensure these fields are properly set for the backend
            title: profileData.title,
            summary: profileData.bio,
            address: profileData.location
          }
        });
        toast.success('Admin profile created successfully!');
        // Redirect to admin dashboard after successful profile creation
        setIsEditing(false);
        navigate('/admin/dashboard');
      } 
      // If updating an existing profile
      else if (currentProfile) {
        console.log('AdminProfile: Updating existing profile...');
        await updateProfile({
          profileId: currentProfile.id,
          formData: profileData
        });
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile submission error:', error);
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white p-8 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Admin Profile' : 'Admin Profile'}
            </h1>
            
            {!isEditing && currentProfile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </motion.button>
            )}
          </div>

          {/* Profile content */}
          {!isEditing && currentProfile ? (
            <div className="space-y-6">
              {/* Avatar display */}
              <div className="flex items-center mb-8">
                <div className="w-24 h-24 bg-indigo-100 rounded-full overflow-hidden">
                  {currentProfile.profilePicture ? (
                    <img 
                      src={currentProfile.profilePicture} 
                      alt={`${currentProfile.firstName}'s avatar`} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-3xl font-semibold">
                      {currentProfile.firstName[0]}
                    </div>
                  )}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {currentProfile.firstName} {currentProfile.lastName}
                  </h2>
                  <p className="text-indigo-600 font-semibold">Administrator</p>
                </div>
              </div>

              {/* Profile details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Title</h3>
                  <p className="text-gray-900">{getProfileValue('professionalTitle')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Phone</h3>
                  <p className="text-gray-900">{currentProfile.phone || 'Not specified'}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Location</h3>
                  <p className="text-gray-900">{getProfileValue('location')}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Email</h3>
                  <p className="text-gray-900">{currentProfile.email}</p>
                </div>
              </div>
              
              {/* Bio */}
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Bio</h3>
                <p className="text-gray-900 whitespace-pre-line">{getProfileValue('bio', 'No bio provided.')}</p>
              </div>

              <div className="pt-6 mt-8 border-t border-gray-200 flex justify-between">
                <button 
                  onClick={() => navigate('/admin/dashboard')} 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <Formik
              initialValues={{
                firstName: currentProfile?.firstName || '',
                lastName: currentProfile?.lastName || '',
                title: getProfileValue('title', ''),
                phone: currentProfile?.phone || '',
                location: getProfileValue('location', ''),
                bio: getProfileValue('bio', ''),
              }}
              validationSchema={AdminProfileSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting: formikSubmitting }) => (
                <Form className="space-y-6">
                  <div className="mb-8">
                    <AvatarUpload
                      profile={currentProfile || {}}
                      size="xl"
                      showProgressBar={true}
                      showDeleteButton={true}
                      onUploadSuccess={() => {
                        toast.success('Avatar updated successfully');
                        fetchMyProfile();
                      }}
                      onUploadError={(error) => toast.error(`Upload failed: ${error}`)}
                    />
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Upload a professional photo for your admin profile
                    </p>
                  </div>
                  
                  {/* Basic Info Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name*
                        </label>
                        <Field
                          type="text"
                          name="firstName"
                          id="firstName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Your first name"
                        />
                        <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name*
                        </label>
                        <Field
                          type="text"
                          name="lastName"
                          id="lastName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Your last name"
                        />
                        <ErrorMessage name="lastName" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Title
                        </label>
                        <Field
                          type="text"
                          name="title"
                          id="title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="e.g. System Administrator"
                        />
                        <ErrorMessage name="title" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Your phone number"
                        />
                        <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <Field
                          type="text"
                          name="location"
                          id="location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="Your location"
                        />
                        <ErrorMessage name="location" component="div" className="mt-1 text-sm text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info Section */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h3>
                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      <Field
                        as="textarea"
                        name="bio"
                        id="bio"
                        rows={5}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Tell us about your role and experience"
                      />
                      <ErrorMessage name="bio" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                  
                  {/* Form Actions */}
                  <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasProfile) {
                          setIsEditing(false);
                        } else {
                          navigate('/admin/dashboard');
                        }
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || formikSubmitting}
                      className={`px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex items-center ${
                        (isSubmitting || formikSubmitting) ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {(isSubmitting || formikSubmitting) && (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                      {currentProfile?.id ? 'Update Profile' : 'Create Profile'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminProfile;
