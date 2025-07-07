# Multi-Language Support Implementation Guide

## Overview
This implementation provides Vietnamese/English language switching for the entire Quickwork application.

## Components Created

### 1. LanguageContext (`src/contexts/LanguageContext.tsx`)
- Provides language state management
- Contains translation dictionaries for Vietnamese and English
- Offers `useLanguage()` hook for components
- Persists language preference in localStorage

### 2. LanguageSwitcher (`src/components/LanguageSwitcher.tsx`)
- Visual toggle component with Vietnamese 🇻🇳 and English 🇺🇸 flags
- Styled with Japanese-inspired design elements

## Implementation Features

### ✅ Completed in Landing Page:
- **Header navigation** - All menu items translated
- **Hero section** - Title, subtitle, search placeholders, button text
- **Popular searches** - Dynamic job titles based on language
- **Statistics section** - Numbers and descriptions
- **Featured companies** - Section title and job count labels
- **Job categories** - Industry names and job counts
- **How it works** - Step titles and descriptions
- **Footer** - All footer links and descriptions
- **Language switcher** - Added to header with modern styling

## How to Extend to Other Modules

### Step 1: Add translations to LanguageContext
```typescript
// Add to src/contexts/LanguageContext.tsx
const translations = {
  vi: {
    // Existing translations...
    'login.title': 'Đăng nhập',
    'login.email': 'Email',
    'login.password': 'Mật khẩu',
    // Add more keys...
  },
  en: {
    // Existing translations...
    'login.title': 'Sign In',
    'login.email': 'Email',
    'login.password': 'Password',
    // Add more keys...
  }
};
```

### Step 2: Use in components
```typescript
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h1>{t('login.title')}</h1>
      <input placeholder={t('login.email')} />
      <input placeholder={t('login.password')} />
    </div>
  );
};
```

### Step 3: Add LanguageSwitcher to other pages
```typescript
import { LanguageSwitcher } from '../components/LanguageSwitcher';

// Add to any page header
<div className="header">
  <LanguageSwitcher />
</div>
```

## Files to Update for Complete Implementation

### High Priority (⚠️ Some Completed):
1. **Authentication Pages** ✅
   - `src/pages/Login.tsx` - ✅ Complete
   - `src/pages/Register.tsx` - ✅ Complete
   - `src/pages/BeforeAuth.tsx` - ⚠️ Needs translation

2. **Dashboard Pages** ✅
   - `src/pages/UserDashboard.tsx` - ✅ Complete
   - `src/pages/EmployerDashboard.tsx` - ✅ Complete
   - `src/pages/AdminDashboard.tsx` - ⚠️ Needs translation

3. **Job Related Pages** ⚠️
   - `src/pages/JobListing.tsx` - ⚠️ Needs translation
   - `src/pages/JobDetail.tsx` - ⚠️ Needs translation
   - `src/pages/JobManagement.tsx` - ⚠️ Needs translation

4. **Profile Pages** ✅
   - `src/features/profile/components/JobSeekerProfile.tsx` - ✅ Complete
   - `src/features/profile/components/EmployerProfile.tsx` - ✅ Complete

### Translation Keys Structure:
```
page.section.element
├── login.form.email
├── login.form.password
├── dashboard.welcome.title
├── jobs.listing.title
├── profile.form.firstName
└── etc...
```

## Language Persistence
- User's language choice is automatically saved to `localStorage`
- Preference is restored on app reload
- Default language is Vietnamese (`vi`)

## Design Features
- **Japanese-inspired design** - Rose/pink color scheme
- **Flag indicators** - 🇻🇳 for Vietnamese, 🇺🇸 for English
- **Smooth transitions** - All language changes are animated
- **Responsive design** - Works on all device sizes

## Animation Features ✨

### Language Change Animations
- **Smooth Text Transitions**: All text elements animate smoothly when switching languages
- **Staggered Animations**: Different elements have slight delays for natural flow
- **AnimatePresence**: Uses Framer Motion's AnimatePresence for enter/exit animations
- **Input Placeholder Updates**: Search input placeholders animate when language changes
- **Popular Search Tags**: Search tags animate individually with staggered timing

### Animation Details:
- **Duration**: 0.3 seconds for text transitions
- **Easing**: Smooth fade and slide animations (opacity + translateY)
- **Stagger**: 0.05-0.1 second delays between elements
- **Key-based Re-rendering**: Uses `languageKey` state to trigger animations

### Implementation:
```typescript
// Animation variants
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Animated text component
const AnimatedText: React.FC<{ 
  children: string; 
  className?: string; 
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${children}-${languageKey}`}
        variants={textVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.3, delay }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
```

## Current Status
✅ **Landing Page** - Fully implemented with comprehensive language support and smooth animations
✅ **Language Context** - Complete with Vietnamese, English, and Japanese translations
✅ **Language Switcher** - Functional component with all three languages (VI, EN, JA)
✅ **App Integration** - Wrapped with LanguageProvider
✅ **Animation System** - Smooth transitions when changing languages
✅ **Auth Module** - LoginForm and RegisterForm with language switcher and translations
✅ **Profile Module** - ProfileHeader with language switcher integration
✅ **Dashboard Module** - UserDashboard and EmployerDashboard with full language support

## Next Steps
1. Extend translations to AdminDashboard and other remaining pages
2. Add more translation keys for complete coverage in all modules
3. Consider adding more languages (e.g., Chinese, Korean)
4. Implement RTL support if needed for future languages

## Benefits
- **Better User Experience** - Users can choose their preferred language
- **Accessibility** - Makes the app accessible to English-speaking users
- **Scalable** - Easy to add more languages in the future
- **Persistent** - User preferences are remembered
- **Type-safe** - All translation keys are checked at compile time
