import React from 'react';

const ParticipantVideo = ({ name, avatar, muted, large }) => {
  return (
    <div className={`relative bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center ${large ? 'col-span-2 row-span-2' : ''}`}>
      {/* Placeholder for video element - ready for WebRTC stream */}
      <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex flex-col items-center justify-center">
        <img src={avatar} alt={name} className="w-16 h-16 rounded-full border-2 border-white/20" />
        <div className="mt-2 text-sm font-medium text-gray-100">{name}</div>
        {muted && <div className="absolute top-2 right-2 text-xs bg-red-600 px-2 py-1 rounded">Muted</div>}
      </div>
    </div>
  );
};

export default ParticipantVideo;

