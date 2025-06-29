/**
 * Experience Manager Component
 * Handles adding, editing, and displaying work experience
 */

import React from 'react';
import { FieldArray, Field, ErrorMessage } from 'formik';
import type { WorkExperience } from '../types/profile.types';

interface ExperienceManagerProps {
  experiences: WorkExperience[];
  fieldPath: string;
}

export const ExperienceManager: React.FC<ExperienceManagerProps> = ({ experiences, fieldPath }) => {
  const createNewExperience = (): WorkExperience => ({
    id: '',
    position: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrently: false,
    description: '',
    achievements: [],
    skills: [],
    location: {
      city: '',
      state: '',
      country: ''
    },
    workLocation: 'on_site',
    employmentType: 'full_time'
  });

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
        <span className="mr-2" aria-hidden="true">💼</span>
        Work Experience
      </h3>
      
      <FieldArray name={fieldPath}>
        {({ push, remove }) => (
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <div 
                key={index}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                    Experience #{index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`Remove experience ${index + 1}`}
                  >
                    <span aria-hidden="true">🗑️</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <label htmlFor={`${fieldPath}.${index}.position`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id={`${fieldPath}.${index}.position`}
                      name={`${fieldPath}.${index}.position`}
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Senior Software Engineer"
                      maxLength={100}
                    />
                    <ErrorMessage name={`${fieldPath}.${index}.position`} component="div" className="text-xs text-red-600 dark:text-red-400" />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <label htmlFor={`${fieldPath}.${index}.company`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id={`${fieldPath}.${index}.company`}
                      name={`${fieldPath}.${index}.company`}
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Tech Company Inc."
                      maxLength={100}
                    />
                    <ErrorMessage name={`${fieldPath}.${index}.company`} component="div" className="text-xs text-red-600 dark:text-red-400" />
                  </div>

                  {/* Start Date */}
                  <div className="space-y-2">
                    <label htmlFor={`${fieldPath}.${index}.startDate`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <Field
                      id={`${fieldPath}.${index}.startDate`}
                      name={`${fieldPath}.${index}.startDate`}
                      type="month"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name={`${fieldPath}.${index}.startDate`} component="div" className="text-xs text-red-600 dark:text-red-400" />
                  </div>

                  {/* End Date / Current */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      End Date
                    </label>
                    <div className="space-y-2">
                      <Field
                        id={`${fieldPath}.${index}.endDate`}
                        name={`${fieldPath}.${index}.endDate`}
                        type="month"
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={experience.isCurrently}
                      />
                      <label className="flex items-center">
                        <Field
                          name={`${fieldPath}.${index}.isCurrently`}
                          type="checkbox"
                          className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">I currently work here</span>
                      </label>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label htmlFor={`${fieldPath}.${index}.location`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </label>
                    <Field
                      id={`${fieldPath}.${index}.location`}
                      name={`${fieldPath}.${index}.location`}
                      type="text"
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., San Francisco, CA"
                      maxLength={100}
                    />
                  </div>

                  {/* Employment Type */}
                  <div className="space-y-2">
                    <label htmlFor={`${fieldPath}.${index}.employmentType`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Employment Type
                    </label>
                    <Field
                      as="select"
                      id={`${fieldPath}.${index}.employmentType`}
                      name={`${fieldPath}.${index}.employmentType`}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="full_time">Full-time</option>
                      <option value="part_time">Part-time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </Field>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-4 space-y-2">
                  <label htmlFor={`${fieldPath}.${index}.description`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <Field
                    as="textarea"
                    id={`${fieldPath}.${index}.description`}
                    name={`${fieldPath}.${index}.description`}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Describe your responsibilities, achievements, and key projects..."
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {experience.description?.length || 0}/500
                  </div>
                </div>
              </div>
            ))}

            {/* Add Experience Button */}
            <button
              type="button"
              onClick={() => push(createNewExperience())}
              className="w-full py-3 px-4 text-sm font-medium text-blue-600 dark:text-blue-400 border-2 border-dashed border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <span className="mr-2" aria-hidden="true">+</span>
              Add Work Experience
            </button>

            {/* Experience Tips */}
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="font-medium mb-1">💡 Tips for work experience:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Start with your most recent position</li>
                <li>Include quantifiable achievements (e.g., "Increased sales by 25%")</li>
                <li>Use action verbs (managed, developed, implemented, led)</li>
                <li>Focus on relevant experience for your target roles</li>
              </ul>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  );
};
