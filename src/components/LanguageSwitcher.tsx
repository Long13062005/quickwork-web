/**
 * Language Switcher Component
 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('vi')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-300 ${
          language === 'vi'
            ? 'bg-rose-500 text-white shadow-md'
            : 'text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700'
        }`}
      >
        🇻🇳 VI
      </button>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-300 ${
          language === 'en'
            ? 'bg-rose-500 text-white shadow-md'
            : 'text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => setLanguage('ja')}
        className={`px-3 py-1 text-sm font-medium rounded-md transition-all duration-300 ${
          language === 'ja'
            ? 'bg-rose-500 text-white shadow-md'
            : 'text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700'
        }`}
      >
        🇯🇵 JA
      </button>
    </div>
  );
};
