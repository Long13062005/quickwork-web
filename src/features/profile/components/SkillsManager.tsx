/**
 * Skills Manager Component
 * Handles adding, editing, and removing skills with tag-like display
 */

import React from 'react';
import { FieldArray, Field } from 'formik';

interface SkillsManagerProps {
  skills: string[];
  fieldPath: string;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ skills, fieldPath }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
        <span className="mr-2" aria-hidden="true">🏷️</span>
        Skills
      </h3>
      
      <FieldArray name={fieldPath}>
        {({ push, remove }) => (
          <div className="space-y-4">
            {/* Skills Display */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="ml-2 p-0.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
                      aria-label={`Remove skill: ${skill}`}
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Skills */}
            <div className="space-y-3">
              {skills.map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Field
                    name={`${fieldPath}.${index}`}
                    type="text"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a skill (e.g., JavaScript, Project Management)"
                    maxLength={50}
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label={`Remove skill field ${index + 1}`}
                  >
                    <span aria-hidden="true">🗑️</span>
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => push('')}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <span className="mr-2" aria-hidden="true">+</span>
                Add Skill
              </button>
            </div>

            {/* Skills Tips */}
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="font-medium mb-1">💡 Tips for adding skills:</p>
              <ul className="text-xs space-y-1 list-disc list-inside">
                <li>Include both technical and soft skills</li>
                <li>Be specific (e.g., "React.js" instead of "Programming")</li>
                <li>Add 5-15 relevant skills for best results</li>
                <li>Include tools, technologies, and methodologies</li>
              </ul>
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  );
};
