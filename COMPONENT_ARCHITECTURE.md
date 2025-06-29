# Role-Based Profile Management UI - Component Architecture

## Overview
This document provides the wireframe, component structure, and implementation details for the Quickwork role-based profile management system.

## 🎯 Design Principles

### Desktop-First Design
- Clean, modern interface optimized for 1200px+ screens
- Professional color scheme with Quickwork branding
- 18px body text with clear visual hierarchy
- Consistent 8px grid spacing system

### Role-Based UI Differentiation
- **Job Seekers**: Blue accent colors, skill-focused layout
- **Employers**: Green accent colors, company-focused layout
- Clear role indicators and appropriate iconography

## 📐 Wireframe Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    PROFILE HEADER                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Avatar] [Name] [Role Badge] [Completion: 85%] [Edit]   │ │
│ │          Contact Info • Location • Status               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    MAIN CONTENT AREA                        │
│                                                             │
│ ┌─── JOB SEEKER VIEW ───┐  ┌─── EMPLOYER VIEW ──────────┐   │
│ │                       │  │                            │   │
│ │ ┌─── OVERVIEW ─────┐   │  │ ┌─── COMPANY OVERVIEW ─┐  │   │
│ │ │ • Summary        │   │  │ │ • Company Info       │  │   │
│ │ │ • Skills Tags    │   │  │ │ • Statistics         │  │   │
│ │ │ • Experience     │   │  │ │ • Description        │  │   │
│ │ └─────────────────┘   │  │ └─────────────────────────┘  │   │
│ │                       │  │                            │   │
│ │ ┌─ COMPLETION ─────┐   │  │ ┌─── COMPLETION ───────┐   │   │
│ │ │ ☑ Personal Info  │   │  │ │ ☑ Company Details    │   │   │
│ │ │ ☑ Skills         │   │  │ │ ☐ Company Logo       │   │   │
│ │ │ ☐ Experience     │   │  │ │ ☑ Contact Info       │   │   │
│ │ └─────────────────┘   │  │ └─────────────────────────┘   │   │
│ └───────────────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     EDIT MODE                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ROLE-BASED FORM with sections:                          │ │
│ │ • Personal Information                                  │ │
│ │ • Professional Summary (rich text editor)              │ │
│ │ • Role-specific fields (Skills/Experience OR Company)   │ │
│ │ • Location & Contact                                    │ │
│ │                                    [Cancel] [Save]     │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Component Structure

### Core Components

#### 1. EnhancedProfileHeader
**Purpose**: Unified header showing user info, role, and completion status

**Props**:
```typescript
interface EnhancedProfileHeaderProps {
  profile: Profile;
  completionPercentage: number;
  isEditing: boolean;
  onEditToggle: () => void;
}
```

**Features**:
- Role badge with icon (👤 Job Seeker, 🏢 Employer)
- Profile completion progress bar
- Edit/view mode toggle
- Contact information display
- Professional avatar with fallback

#### 2. RoleBasedProfileForm
**Purpose**: Dynamic form that adapts based on user role

**Props**:
```typescript
interface RoleBasedProfileFormProps {
  profile: Profile;
  onSave: (data: Partial<Profile>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}
```

**Features**:
- Formik-based validation with Yup schemas
- Role-specific field sets
- Real-time validation feedback
- Auto-save functionality
- Rich text summary editor

#### 3. SkillsManager (Job Seekers Only)
**Purpose**: Interactive skills management with tags

**Props**:
```typescript
interface SkillsManagerProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  isEditable: boolean;
}
```

**Features**:
- Add/remove skills as chips
- Skill suggestions/autocomplete
- Category-based skill organization
- Keyboard navigation support

#### 4. ExperienceManager (Job Seekers Only)
**Purpose**: Work experience CRUD interface

**Props**:
```typescript
interface ExperienceManagerProps {
  experiences: Experience[];
  onExperiencesChange: (experiences: Experience[]) => void;
  isEditable: boolean;
}
```

**Features**:
- Add/edit/delete experiences
- Date validation
- Current position indicator
- Rich text descriptions

### Role-Specific Components

#### Job Seeker Profile Components

**JobSeekerOverview**:
```typescript
- Professional summary display
- Skills as interactive tags
- Experience timeline
- Profile completion checklist
```

**Skills Display**:
```jsx
<div className="flex flex-wrap gap-2">
  {skills.map(skill => (
    <span className="skill-tag">{skill}</span>
  ))}
</div>
```

#### Employer Profile Components

**CompanyOverview**:
```typescript
- Company logo and branding
- Company statistics dashboard
- Industry and size information
- Verification status badge
```

**CompanyStats**:
```jsx
<div className="stats-grid">
  <StatCard label="Active Jobs" value={12} color="blue" />
  <StatCard label="Applications" value={248} color="green" />
  <StatCard label="Interviews" value={15} color="purple" />
  <StatCard label="Hires" value={8} color="orange" />
</div>
```

## 🎨 Sample Code Snippets

### 1. Editable Field Component
```tsx
interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
}

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSave,
  isEditing,
  type = 'text',
  placeholder,
  maxLength,
  required = false
}) => {
  const [editValue, setEditValue] = useState(value);
  
  if (!isEditing) {
    return (
      <div className="field-display">
        <label className="field-label">{label}</label>
        <div className="field-value">
          {value || <span className="field-empty">Not provided</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="field-edit">
      <label className="field-label" htmlFor={`field-${label}`}>
        {label} {required && <span className="required">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={`field-${label}`}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onSave(editValue)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="field-input field-textarea"
          rows={4}
        />
      ) : (
        <input
          id={`field-${label}`}
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => onSave(editValue)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="field-input"
        />
      )}
      {maxLength && (
        <div className="field-counter">
          {editValue.length}/{maxLength}
        </div>
      )}
    </div>
  );
};
```

### 2. Skills Tag Component
```tsx
interface SkillTagProps {
  skill: string;
  onRemove?: () => void;
  isEditable?: boolean;
}

const SkillTag: React.FC<SkillTagProps> = ({ 
  skill, 
  onRemove, 
  isEditable = false 
}) => {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${isEditable 
          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }
        border border-blue-200 dark:border-blue-800
      `}
    >
      {skill}
      {isEditable && onRemove && (
        <button
          onClick={onRemove}
          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          aria-label={`Remove ${skill} skill`}
        >
          ×
        </button>
      )}
    </motion.span>
  );
};
```

### 3. Summary Editor with Rich Text Preview
```tsx
interface SummaryEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const SummaryEditor: React.FC<SummaryEditorProps> = ({
  value,
  onChange,
  placeholder = "Write a compelling professional summary...",
  maxLength = 2000
}) => {
  const [isPreview, setIsPreview] = useState(false);
  
  const handleMarkdownPreview = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="summary-editor">
      <div className="editor-header">
        <label className="editor-label">Professional Summary</label>
        <div className="editor-controls">
          <button
            type="button"
            onClick={() => setIsPreview(!isPreview)}
            className="preview-toggle"
          >
            {isPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>
      
      {isPreview ? (
        <div 
          className="summary-preview"
          dangerouslySetInnerHTML={{ 
            __html: handleMarkdownPreview(value) 
          }}
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="summary-textarea"
          rows={8}
        />
      )}
      
      <div className="editor-footer">
        <span className="character-count">
          {value.length}/{maxLength}
        </span>
        <span className="markdown-hint">
          Supports **bold** and *italic* formatting
        </span>
      </div>
    </div>
  );
};
```

### 4. Profile Completion Progress
```tsx
interface CompletionProgressProps {
  percentage: number;
  missingFields: string[];
  profileType: 'job_seeker' | 'employer';
}

const CompletionProgress: React.FC<CompletionProgressProps> = ({
  percentage,
  missingFields,
  profileType
}) => {
  const getColorScheme = () => {
    if (percentage >= 90) return 'green';
    if (percentage >= 70) return 'blue';
    if (percentage >= 50) return 'yellow';
    return 'red';
  };

  const colorScheme = getColorScheme();

  return (
    <div className="completion-progress">
      <div className="progress-header">
        <h3 className="progress-title">Profile Completion</h3>
        <span className="progress-percentage">{percentage}%</span>
      </div>
      
      <div className="progress-bar-container">
        <motion.div
          className={`progress-bar progress-${colorScheme}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {missingFields.length > 0 && (
        <div className="missing-fields">
          <p className="missing-fields-title">Complete your profile:</p>
          <ul className="missing-fields-list">
            {missingFields.map((field, index) => (
              <li key={index} className="missing-field-item">
                {field}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

## 🎯 User Experience Flow

### Authentication & Onboarding
1. **BeforeAuth**: Email check entry point
2. **Login/Register**: Guided authentication
3. **ChooseRole**: Role selection with clear explanation
4. **Profile Setup**: Initial profile creation based on role

### Profile Management
1. **Overview Mode**: Read-only view with completion status
2. **Edit Mode**: Full editing capabilities with validation
3. **Save States**: Clear feedback on save/error states
4. **Completion Tracking**: Visual progress toward complete profile

### Role-Specific Features

#### Job Seekers
- Skills management with autocomplete
- Experience timeline with rich descriptions
- Professional summary with markdown support
- Portfolio/work samples section

#### Employers
- Company branding and logo upload
- Team size and industry selection
- Company culture and benefits
- Job posting integration

## 🔧 Technical Implementation

### State Management
- Redux for global profile state
- Formik for form state management
- Local state for UI interactions

### Validation
- Yup schemas for form validation
- Real-time validation feedback
- Server-side validation integration

### Performance
- Lazy loading for components
- Optimized re-renders with React.memo
- Image optimization and lazy loading

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation throughout
- Screen reader compatibility
- High contrast mode support

This architecture provides a scalable, maintainable, and highly accessible profile management system that adapts to different user roles while maintaining a consistent, professional user experience.
