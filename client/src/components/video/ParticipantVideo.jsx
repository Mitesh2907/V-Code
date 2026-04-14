import React, { useEffect, useRef } from "react";

const ParticipantVideo = ({ stream, name = "User", camOn = true }) => {
  const videoRef = useRef(null);

  // 🔥 Attach stream
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play().catch(() => {});
    };
  }, [stream]);

  // 🔥 initials
  const getInitials = (fullName) => {
    if (!fullName) return "U";

    const parts = fullName.trim().split(" ");

    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">

      {/* 🎥 VIDEO */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        className="w-full h-full object-cover"
        style={{ display: camOn ? "block" : "none" }}
      />

      {/* 🔴 CAMERA OFF UI */}
      {!camOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black">
          
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
            {getInitials(name)}
          </div>

          <span className="text-sm mt-2">{name}</span>
          <span className="text-xs opacity-60">Camera Off</span>
        </div>
      )}
    </div>
  );
};

export default ParticipantVideo;