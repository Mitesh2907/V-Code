import React, { useEffect, useRef } from "react";

const ParticipantVideo = ({ stream, name, camOn = true }) => {
  const videoRef = useRef(null);

  const getInitials = (fullName) => {
    if (!fullName) return "U";

    const parts = fullName.trim().split(" ");

    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center w-full h-full">

      {/* VIDEO */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
        style={{ display: camOn ? "block" : "none" }}
      />

      {/* CAMERA OFF UI */}
      {!camOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
            {getInitials(name)}
          </div>

          <span className="mt-2">{name}</span>
          <span className="text-xs opacity-60">Camera Off</span>
        </div>
      )}
    </div>
  );
};

export default ParticipantVideo;