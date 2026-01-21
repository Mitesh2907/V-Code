import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader = ({
  size = 'md',
  variant = 'spinner',
  message,
  className = '',
  fullScreen = false
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const variants = {
    spinner: (
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 dark:text-blue-400 ${className}`} />
    ),
    dots: (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`${size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'} bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    ),
    bars: (
      <div className={`flex space-x-1 ${className}`}>
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={`${size === 'sm' ? 'w-1 h-6' : 'w-2 h-8'} bg-blue-600 dark:bg-blue-400 animate-pulse`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    ),
    ring: (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <div className="absolute inset-0 border-2 border-gray-200 dark:border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
    ),
  };

  const content = (
    <div className="flex flex-col items-center justify-center">
      {variants[variant]}
      {message && (
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm font-medium">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-80 dark:bg-opacity-80 z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;