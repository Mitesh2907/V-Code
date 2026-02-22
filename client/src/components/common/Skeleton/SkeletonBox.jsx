import React from 'react';

const SkeletonBox = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-6', 
  rounded = 'rounded-md',
  shimmer = true
}) => {
  return (
    <div
      className={`
        ${width} 
        ${height} 
        ${rounded}
        ${shimmer ? 'bg-gradient-shimmer animate-shimmer' : 'bg-gray-200 dark:bg-gray-700 animate-pulse'}
        ${className}
      `}
    />
  );
};

export default SkeletonBox;