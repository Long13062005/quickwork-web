import { useState, useEffect } from 'react'

export const PageLoader = () => {
  const [isDark] = useState(() => {
      // Initialize from localStorage or system preference
      if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' ||
          (localStorage.getItem('theme') === null &&
            window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      return false;
    });


  useEffect(() => {
      const html = document.documentElement
      if (isDark) {
        html.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        html.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }, [isDark])

  return (
    <div className={`fixed inset-0 flex items-center justify-center transition-all duration-500 overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900' 
        : 'bg-gradient-to-br from-red-50 via-pink-50 to-orange-50'
    }`}>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-pulse transition-colors duration-500 ${
          isDark ? 'bg-red-800/10' : 'bg-red-200/20'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full blur-3xl animate-pulse delay-1000 transition-colors duration-500 ${
          isDark ? 'bg-pink-800/10' : 'bg-pink-200/20'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-2xl animate-pulse delay-500 transition-colors duration-500 ${
          isDark ? 'bg-orange-800/10' : 'bg-orange-200/20'
        }`}></div>
      </div>

    {/* Main loading content */}
    <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
      {/* Brand header */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-xl">
            <svg 
              className="w-6 h-6 text-white animate-pulse" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-pink-500 rounded-xl blur opacity-75 animate-pulse"></div>
        </div>
          <div>
            <h1 className={`text-2xl lg:text-3xl font-bold transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-zinc-800'
            }`}>Quickwork</h1>
            <p className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>Professional Workspace</p>
          </div>
      </div>

      {/* Advanced spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className={`w-20 h-20 border-4 rounded-full transition-colors duration-300 ${
          isDark ? 'border-red-900/30' : 'border-red-100'
        }`} 
             style={{animation: 'spin 3s linear infinite'}}></div>
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-red-400 border-r-pink-400 rounded-full animate-spin"></div>
        
        {/* Inner fast ring */}
        <div className="absolute inset-4 w-12 h-12 border-2 border-transparent border-t-orange-500 rounded-full animate-spin" 
             style={{animationDuration: '0.8s'}}></div>
        
        {/* Center pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></div>
        </div>
      </div>

      {/* Loading text with animated dots */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-1">
          <span className={`text-lg font-semibold transition-colors duration-300 ${
            isDark ? 'text-zinc-200' : 'text-zinc-700'
          }`}>Loading</span>
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" 
                 style={{animationDelay: '0ms'}}></div>
            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-bounce" 
                 style={{animationDelay: '150ms'}}></div>
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" 
                 style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
        <p className={`text-sm max-w-xs text-center transition-colors duration-300 ${
          isDark ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Preparing your workspace experience...
        </p>
      </div>

      {/* Progress indicator */}
      <div className={`w-48 h-1 rounded-full overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-gray-700' : 'bg-gray-200'
      }`}>
        <div className="h-full bg-gradient-to-r from-red-500 via-pink-500 to-orange-500 rounded-full animate-pulse shadow-sm"></div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 right-20 w-3 h-3 bg-red-400/60 rounded-full animate-bounce" 
           style={{animationDuration: '3s'}}></div>
      <div className="absolute bottom-32 left-16 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce" 
           style={{animationDuration: '2.5s', animationDelay: '1s'}}></div>
      <div className="absolute top-32 left-32 w-2.5 h-2.5 bg-orange-400/60 rounded-full animate-bounce" 
           style={{animationDuration: '4s', animationDelay: '0.5s'}}></div>

      {/* Theme indicator */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 opacity-50">
        <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${
          isDark ? 'bg-blue-400' : 'bg-yellow-400'
        }`}></div>
        <span className={`text-xs transition-colors duration-300 ${
          isDark ? 'text-zinc-400' : 'text-zinc-600'
        }`}>
          {isDark ? 'Dark' : 'Light'}
        </span>
      </div>
    </div>
  </div>
  )
}