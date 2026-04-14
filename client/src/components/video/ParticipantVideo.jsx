import React, { useEffect, useRef } from "react";

const ParticipantVideo = ({ stream, name = "User", camOn = true }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (camOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, camOn]);

  const getInitials = (n) => {
    const parts = n.split(" ");
    return parts.map(p => p[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="relative bg-gray-900 rounded-xl overflow-hidden h-64 w-full flex items-center justify-center border border-gray-700">
      {camOn && stream && stream.active ? (
        <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover" />
      ) : (
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-black text-2xl font-bold">
            {getInitials(name)}
          </div>
          <p className="text-white mt-3 font-medium">{name}</p>
          <p className="text-gray-400 text-xs mt-1">{!camOn ? "Camera Off" : "Connecting..."}</p>
        </div>
      )}
    </div>
  );
};

export default ParticipantVideo;