import React from 'react';
import SkeletonBox from './SkeletonBox';
import SkeletonText from './SkeletonText';

const SkeletonCard = ({ type = 'default' }) => {
  if (type === 'room') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <SkeletonBox 
            height="h-12" 
            width="w-12" 
            rounded="rounded-lg" 
            shimmer={true}
          />
          <SkeletonBox height="h-6" width="w-20" shimmer={true} />
        </div>
        
        <SkeletonText lines={2} variant="title" className="mb-4" />
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center space-x-2">
            <SkeletonBox height="h-4" width="w-4" rounded="rounded" shimmer={true} />
            <SkeletonBox height="h-4" width="w-32" shimmer={true} />
          </div>
          <div className="flex items-center space-x-2">
            <SkeletonBox height="h-4" width="w-4" rounded="rounded" shimmer={true} />
            <SkeletonBox height="h-4" width="w-24" shimmer={true} />
          </div>
        </div>

        <div className="flex space-x-3">
          <SkeletonBox height="h-10" width="w-full" shimmer={true} />
          <SkeletonBox height="h-10" width="w-full" shimmer={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <SkeletonBox height="h-8" width="w-1/2" className="mb-4" shimmer={true} />
      <SkeletonText lines={3} className="mb-6" />
      <SkeletonBox height="h-10" width="w-full" shimmer={true} />
    </div>
  );
};

export default SkeletonCard;