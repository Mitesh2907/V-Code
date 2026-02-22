import React from 'react';
import SkeletonBox from './SkeletonBox';

const SkeletonText = ({ 
  lines = 3, 
  variant = 'paragraph',
  className = ''
}) => {
  const config = {
    heading: { height: 'h-8', lastWidth: 'w-3/4' },
    title: { height: 'h-6', lastWidth: 'w-1/2' },
    paragraph: { height: 'h-4', lastWidth: 'w-full' },
  };

  const { height, lastWidth } = config[variant];

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <SkeletonBox
          key={idx}
          height={height}
          width={idx === lines - 1 ? lastWidth : 'w-full'}
          shimmer={true}
        />
      ))}
    </div>
  );
};

export default SkeletonText;