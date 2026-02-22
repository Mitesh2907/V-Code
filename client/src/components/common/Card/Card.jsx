import React from 'react';

const Card = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  padding = 'p-6',
  shadow = 'shadow-md',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        rounded-xl 
        bg-white 
        dark:bg-gray-800 
        ${bordered ? 'border border-gray-200 dark:border-gray-700' : ''}
        ${shadow}
        ${padding}
        ${hoverable ? 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-gray-600 dark:text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

export default Card;