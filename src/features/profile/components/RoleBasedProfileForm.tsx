/**
 * Role-based profile form component
 * Handles both Job Seeker and Employer profile editing with validation
 */

import React, { useState, useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import type { Profile, JobSeekerProfile, EmployerProfile } from '../types/profile.types';

interface RoleBasedProfileFormProps {
  profile: Profile;
  onSave: (data: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

/**
 * Validation schemas for different profile types
 */
const getValidationSchema = (role: string) => {
  const baseSchema = {
    firstName: Yup.string()
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be less than 50 characters')
      .required('First name is required'),
    lastName: Yup.string()
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be less than 50 characters')
      .required('Last name is required'),
    phone: Yup.string()
      .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
      .max(20, 'Phone number is too long'),
    bio: Yup.string()
      .max(1000, 'Summary must be less than 1000 characters'),
    'location.city': Yup.string().max(100, 'City name is too long'),
    'location.state': Yup.string().max(100, 'State name is too long'),
    'location.country': Yup.string().max(100, 'Country name is too long')
  };

  if (role === 'employer') {
    return Yup.object({
      ...baseSchema,
      'employerData.companyName': Yup.string()
        .min(2, 'Company name must be at least 2 characters')
        .max(100, 'Company name must be less than 100 characters')
        .required('Company name is required'),
      'employerData.companyWebsite': Yup.string()
        .url('Please enter a valid website URL')
        .max(200, 'Website URL is too long')
    });
  }

  return Yup.object(baseSchema);
};

/**
 * Role-based profile form component
 */
export const RoleBasedProfileForm: React.FC<RoleBasedProfileFormProps> = ({
  profile,
  onSave,
  onCancel,
  isLoading
}) => {
  const [showSummaryPreview, setShowSummaryPreview] = useState(false);
  const isJobSeeker = profile.role === 'job_seeker';
  const isEmployer = profile.role === 'employer';

  const getInitialValues = () => {
    const base = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      phone: profile.phone || '',
      bio: profile.bio || '',
      location: {
        city: profile.location?.city || '',
        state: profile.location?.state || '',
        country: profile.location?.country || ''
      }
    };

    if (isEmployer) {
      const employerProfile = profile as EmployerProfile;
      return {
        ...base,
        employerData: {
          companyName: employerProfile.employerData?.companyName || '',
          companyWebsite: employerProfile.employerData?.companyWebsite || '',
          companyDescription: employerProfile.employerData?.companyDescription || '',
          industry: employerProfile.employerData?.industry || '',
          companySize: employerProfile.employerData?.companySize || ''
        }
      };
    }

    if (isJobSeeker) {
      const jobSeekerProfile = profile as JobSeekerProfile;
      return {
        ...base,
        jobSeekerData: {
          title: jobSeekerProfile.jobSeekerData?.title || '',
          summary: jobSeekerProfile.jobSeekerData?.summary || '',
          skills: jobSeekerProfile.jobSeekerData?.skills || [],
          experience: jobSeekerProfile.jobSeekerData?.experience || []
        }
      };
    }

    return base;
  };

  const handleSubmit = useCallback(async (values: any) => {
    try {
      await onSave(values);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  }, [onSave]);

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
      <Formik
        initialValues={getInitialValues()}
        validationSchema={getValidationSchema(profile.role)}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting }) => (
          <Form className="p-8 space-y-8">
            {/* Basic Information Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="mr-2" aria-hidden="true">📋</span>
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* First Name */}
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    maxLength={50}
                    className={`
                      w-full px-4 py-3 text-lg border rounded-lg transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.firstName && touched.firstName
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                    placeholder="Enter your first name"
                    aria-describedby="firstName-error"
                  />
                  <ErrorMessage name="firstName" component="div" id="firstName-error" className="text-sm text-red-600 dark:text-red-400" />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name <span className="text-red-500" aria-label="required">*</span>
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    maxLength={50}
                    className={`
                      w-full px-4 py-3 text-lg border rounded-lg transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.lastName && touched.lastName
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                    placeholder="Enter your last name"
                    aria-describedby="lastName-error"
                  />
                  <ErrorMessage name="lastName" component="div" id="lastName-error" className="text-sm text-red-600 dark:text-red-400" />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <Field
                    id="phone"
                    name="phone"
                    type="tel"
                    maxLength={20}
                    className={`
                      w-full px-4 py-3 text-lg border rounded-lg transition-colors
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.phone && touched.phone
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                    placeholder="+1 (555) 123-4567"
                    aria-describedby="phone-error"
                  />
                  <ErrorMessage name="phone" component="div" id="phone-error" className="text-sm text-red-600 dark:text-red-400" />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <label htmlFor="location.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Location
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Field
                      id="location.city"
                      name="location.city"
                      type="text"
                      placeholder="City"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Field
                      id="location.state"
                      name="location.state"
                      type="text"
                      placeholder="State"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Company Information Section (Employer Only) */}
            {isEmployer && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="mr-2" aria-hidden="true">🏢</span>
                  Company Information
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label htmlFor="employerData.companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Name <span className="text-red-500" aria-label="required">*</span>
                    </label>
                    <Field
                      id="employerData.companyName"
                      name="employerData.companyName"
                      type="text"
                      maxLength={100}
                      className={`
                        w-full px-4 py-3 text-lg border rounded-lg transition-colors
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${(errors as any).employerData?.companyName && (touched as any).employerData?.companyName
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        }
                        text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      `}
                      placeholder="Enter company name"
                      aria-describedby="companyName-error"
                    />
                    <ErrorMessage name="employerData.companyName" component="div" id="companyName-error" className="text-sm text-red-600 dark:text-red-400" />
                  </div>

                  {/* Company Website */}
                  <div className="space-y-2">
                    <label htmlFor="employerData.companyWebsite" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company Website
                    </label>
                    <Field
                      id="employerData.companyWebsite"
                      name="employerData.companyWebsite"
                      type="url"
                      maxLength={200}
                      className={`
                        w-full px-4 py-3 text-lg border rounded-lg transition-colors
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${(errors as any).employerData?.companyWebsite && (touched as any).employerData?.companyWebsite
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                        }
                        text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                      `}
                      placeholder="https://company.com"
                      aria-describedby="companyWebsite-error"
                    />
                    <ErrorMessage name="employerData.companyWebsite" component="div" id="companyWebsite-error" className="text-sm text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </section>
            )}

            {/* Professional Information Section (Job Seeker Only) */}
            {isJobSeeker && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="mr-2" aria-hidden="true">💼</span>
                  Professional Information
                </h2>
                
                {/* Professional Title */}
                <div className="space-y-2 mb-6">
                  <label htmlFor="jobSeekerData.title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Professional Title
                  </label>
                  <Field
                    id="jobSeekerData.title"
                    name="jobSeekerData.title"
                    type="text"
                    maxLength={100}
                    className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Skills</h3>
                  <FieldArray name="jobSeekerData.skills">
                    {({ push, remove }) => (
                      <div className="space-y-3">
                        {(values as any).jobSeekerData?.skills?.map((skill: string, index: number) => (
                          <div key={index} className="flex items-center space-x-3">
                            <Field
                              name={`jobSeekerData.skills.${index}`}
                              type="text"
                              className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter a skill"
                            />
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="p-2 text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                              aria-label={`Remove skill ${skill}`}
                            >
                              <span aria-hidden="true">✕</span>
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => push('')}
                          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <span className="mr-2" aria-hidden="true">+</span>
                          Add Skill
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>
              </section>
            )}

            {/* Summary Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                <span className="mr-2" aria-hidden="true">📝</span>
                {isEmployer ? 'Company Description' : 'Professional Summary'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isEmployer ? 'Tell us about your company' : 'Tell us about yourself'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSummaryPreview(!showSummaryPreview)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline focus:outline-none focus:underline"
                  >
                    {showSummaryPreview ? 'Edit' : 'Preview'}
                  </button>
                </div>
                
                {showSummaryPreview ? (
                  <div className="w-full min-h-[120px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {values.bio || <span className="text-gray-500 dark:text-gray-400 italic">No summary provided</span>}
                    </div>
                  </div>
                ) : (
                  <Field
                    as="textarea"
                    id="bio"
                    name="bio"
                    rows={6}
                    maxLength={1000}
                    className={`
                      w-full px-4 py-3 text-lg border rounded-lg transition-colors resize-vertical
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${errors.bio && touched.bio
                        ? 'border-red-500 bg-red-50 dark:bg-red-950/20' 
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      }
                      text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
                    `}
                    placeholder={isEmployer 
                      ? "Describe your company, culture, and what makes you unique..." 
                      : "Describe your professional background, experience, and career goals..."
                    }
                    aria-describedby="bio-error bio-help"
                  />
                )}
                
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span id="bio-help">Supports basic formatting. Be descriptive and professional.</span>
                  <span>{values.bio?.length || 0}/1000</span>
                </div>
                <ErrorMessage name="bio" component="div" id="bio-error" className="text-sm text-red-600 dark:text-red-400" />
              </div>
            </section>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting || isLoading}
                className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting || isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
