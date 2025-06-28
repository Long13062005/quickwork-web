import React from 'react';
import type { Profile, JobSeekerProfile, EmployerProfile } from '../types/profile.types';

interface ProfilePreviewProps {
  profile: Profile;
  section?: string;
}

export const ProfilePreview: React.FC<ProfilePreviewProps> = ({
  profile,
  section = 'basic'
}) => {
  const renderBasicPreview = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-16 h-16 rounded-full object-cover"
          />
        )}
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h3>
          <p className="text-gray-600">{profile.email}</p>
          {profile.phone && (
            <p className="text-gray-600">{profile.phone}</p>
          )}
        </div>
      </div>
      
      {profile.bio && (
        <div>
          <h4 className="font-medium text-gray-900 mb-2">About</h4>
          <p className="text-gray-700">{profile.bio}</p>
        </div>
      )}
    </div>
  );

  const renderSkillsPreview = () => {
    if (profile.role !== 'job_seeker') return null;
    
    const jobSeekerProfile = profile as JobSeekerProfile;
    const skills = jobSeekerProfile.jobSeekerData?.skills || [];
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Skills</h4>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No skills added yet</p>
        )}
      </div>
    );
  };

  const renderExperiencePreview = () => {
    if (profile.role !== 'job_seeker') return null;
    
    const jobSeekerProfile = profile as JobSeekerProfile;
    const experiences = jobSeekerProfile.jobSeekerData?.experience || [];
    
    return (
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Experience</h4>
        {experiences.length > 0 ? (
          <div className="space-y-4">
            {experiences.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-4">
                <h5 className="font-medium text-gray-900">{exp.position}</h5>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">
                  {exp.startDate} - {exp.isCurrently ? 'Present' : exp.endDate}
                </p>
                {exp.description && (
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No experience added yet</p>
        )}
      </div>
    );
  };

  const renderCompanyPreview = () => {
    if (profile.role !== 'employer') return null;
    
    const employerProfile = profile as EmployerProfile;
    const companyData = employerProfile.employerData;
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {companyData?.companyLogo && (
            <img
              src={companyData.companyLogo}
              alt={companyData.companyName}
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {companyData?.companyName}
            </h3>
            <p className="text-gray-600">{companyData?.industry}</p>
            <p className="text-gray-600">{companyData?.companySize}</p>
          </div>
        </div>
        
        {companyData?.companyDescription && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">About Company</h4>
            <p className="text-gray-700">{companyData.companyDescription}</p>
          </div>
        )}
        
        {companyData?.companyWebsite && (
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Website</h4>
            <a
              href={companyData.companyWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {companyData.companyWebsite}
            </a>
          </div>
        )}
      </div>
    );
  };

  const renderSectionPreview = () => {
    switch (section) {
      case 'basic':
        return renderBasicPreview();
      case 'skills':
        return renderSkillsPreview();
      case 'experience':
        return renderExperiencePreview();
      case 'company':
        return renderCompanyPreview();
      default:
        return renderBasicPreview();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
        <span className="text-sm text-gray-500">How others see your profile</span>
      </div>
      
      {renderSectionPreview()}
    </div>
  );
};
