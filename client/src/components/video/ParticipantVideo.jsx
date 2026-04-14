import React, { useEffect, useRef } from "react";

const ParticipantVideo = ({ stream, name = "User", camOn = true }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (camOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play().catch((err) => console.log("Video Play Error:", err));
      };
    }
  }, [stream, camOn]);

  const getInitials = (fullName) => {
    if (!fullName || fullName === "undefined") return "U";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  return (
    <div className="relative bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center h-64 w-full">
      {/* 🔥 Check: Stream aur camOn dono hone chahiye video ke liye */}
      {camOn && stream ? (
        <video
          ref={videoRef}
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
            {getInitials(name)}
          </div>
          <span className="text-sm mt-2">{name}</span>
          <span className="text-xs opacity-60">
            {!camOn ? "Camera Off" : "Connecting..."}
          </span>
        </div>
      )}
    </div>
  );
};

export default ParticipantVideo;