import React from 'react';
import SkeletonBox from './SkeletonBox';

const SkeletonEditor = () => {
  return (
    <div className="flex h-screen bg-gray-900">
      {/* File Explorer */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4">
        <SkeletonBox height="h-8" width="w-1/2" className="mb-6" shimmer={true} />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center space-x-2">
              <SkeletonBox height="h-4" width="w-4" rounded="rounded" shimmer={true} />
              <SkeletonBox height="h-4" width="w-32" shimmer={true} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 p-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-4">
          {[1, 2, 3].map(i => (
            <SkeletonBox key={i} height="h-10" width="w-32" shimmer={true} />
          ))}
        </div>

        {/* Code Editor Area */}
        <div className="bg-gray-800 rounded-lg p-4">
          {/* Line Numbers + Code */}
          <div className="flex space-x-4">
            <div className="w-12 space-y-1">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <SkeletonBox key={i} height="h-6" shimmer={true} />
              ))}
            </div>
            <div className="flex-1 space-y-1">
              {['w-1/4', 'w-1/2', 'w-3/4', 'w-1/3', 'w-2/3'].map((width, i) => (
                <SkeletonBox key={i} height="h-6" width={width} shimmer={true} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Users Panel */}
      <div className="w-56 bg-gray-800 border-l border-gray-700 p-4">
        <SkeletonBox height="h-8" width="w-3/4" className="mb-6" shimmer={true} />
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center space-x-3">
              <SkeletonBox height="h-10" width="w-10" rounded="rounded-full" shimmer={true} />
              <SkeletonBox height="h-4" width="w-24" shimmer={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonEditor;