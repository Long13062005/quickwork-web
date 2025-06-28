import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { Profile, JobSeekerProfile, EmployerProfile } from '../types/profile.types';
import { useProfileUpdate } from '../hooks/useProfileUpdate';
import { FormField } from '../../../components/common/FormField/FormField';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner/LoadingSpinner';

interface ProfileFormProps {
  profile: Profile;
  section?: string;
  onSave?: (data: Partial<Profile>) => void;
  isEditable?: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  section = 'basic',
  onSave,
  isEditable = true
}) => {
  const { saveProfile, isSaving } = useProfileUpdate();

  // Basic validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string(),
    bio: Yup.string()
  });

  const getInitialValues = () => {
    switch (section) {
      case 'basic':
        return {
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          bio: profile.bio || ''
        };
      case 'skills':
        if (profile.role === 'job_seeker') {
          const jobSeekerProfile = profile as JobSeekerProfile;
          return {
            skills: jobSeekerProfile.jobSeekerData?.skills || []
          };
        }
        return {};
      case 'company':
        if (profile.role === 'employer') {
          const employerProfile = profile as EmployerProfile;
          return {
            companyName: employerProfile.employerData?.companyName || '',
            industry: employerProfile.employerData?.industry || '',
            companySize: employerProfile.employerData?.companySize || '',
            companyDescription: employerProfile.employerData?.companyDescription || '',
            companyWebsite: employerProfile.employerData?.companyWebsite || ''
          };
        }
        return {};
      default:
        return {};
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      await saveProfile('save_draft');
      onSave?.(values);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  const renderBasicFields = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="firstName"
          type="text"
          label="First Name"
          placeholder="Enter your first name"
          disabled={!isEditable}
        />
        <FormField
          name="lastName"
          type="text"
          label="Last Name"
          placeholder="Enter your last name"
          disabled={!isEditable}
        />
      </div>
      <FormField
        name="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        disabled={!isEditable}
      />
      <FormField
        name="phone"
        type="tel"
        label="Phone"
        placeholder="Enter your phone number"
        disabled={!isEditable}
      />
      <div className="space-y-2">
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio
        </label>
        <Field
          as="textarea"
          name="bio"
          rows={4}
          placeholder="Tell us about yourself"
          disabled={!isEditable}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />
      </div>
    </>
  );

  const renderSkillsFields = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          Skills
        </label>
        <Field
          name="skills"
          type="text"
          placeholder="Add your skills (comma-separated)"
          disabled={!isEditable}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <p className="text-sm text-gray-500">
          Enter skills separated by commas (e.g., JavaScript, React, Node.js)
        </p>
        <ErrorMessage name="skills" component="div" className="text-red-500 text-sm" />
      </div>
    </div>
  );

  const renderCompanyFields = () => (
    <>
      <FormField
        name="companyName"
        type="text"
        label="Company Name"
        placeholder="Enter company name"
        disabled={!isEditable}
      />
      <FormField
        name="industry"
        type="text"
        label="Industry"
        placeholder="Enter industry"
        disabled={!isEditable}
      />
      <div className="space-y-2">
        <label htmlFor="companySize" className="block text-sm font-medium text-gray-700">
          Company Size
        </label>
        <Field
          as="select"
          name="companySize"
          disabled={!isEditable}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        >
          <option value="">Select company size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501-1000">501-1000 employees</option>
          <option value="1000+">1000+ employees</option>
        </Field>
        <ErrorMessage name="companySize" component="div" className="text-red-500 text-sm" />
      </div>
      <FormField
        name="companyWebsite"
        type="url"
        label="Website"
        placeholder="Enter company website"
        disabled={!isEditable}
      />
      <div className="space-y-2">
        <label htmlFor="companyDescription" className="block text-sm font-medium text-gray-700">
          Company Description
        </label>
        <Field
          as="textarea"
          name="companyDescription"
          rows={4}
          placeholder="Describe your company"
          disabled={!isEditable}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
        />
        <ErrorMessage name="companyDescription" component="div" className="text-red-500 text-sm" />
      </div>
    </>
  );

  const renderSectionFields = () => {
    switch (section) {
      case 'basic':
        return renderBasicFields();
      case 'skills':
        return renderSkillsFields();
      case 'company':
        return renderCompanyFields();
      default:
        return null;
    }
  };

  return (
    <Formik
      initialValues={getInitialValues()}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ isValid, dirty }) => (
        <Form className="space-y-6">
          {renderSectionFields()}
          
          {isEditable && (
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || !dirty || isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSaving && <LoadingSpinner size="sm" />}
                <span>Save Changes</span>
              </button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};
