import React, { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (localStorage.getItem('theme') === null &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <button
      className="p-2 rounded-full bg-white/30 dark:bg-zinc-800/30 border dark:border-zinc-600 transition"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
}