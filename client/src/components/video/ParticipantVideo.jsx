import React, { useEffect, useRef } from "react";

const ParticipantVideo = ({ stream, name = "User", camOn = true }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (camOn && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream, camOn]);

  const initials = name.split(" ").map(n => n[0]).join("").toUpperCase();

  return (
    <div className="relative bg-gray-800 rounded-2xl h-64 flex items-center justify-center border border-gray-600">
      {camOn && stream ? (
        <video ref={videoRef} playsInline autoPlay className="w-full h-full object-cover rounded-2xl" />
      ) : (
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
            {initials || "U"}
          </div>
          <p className="text-white mt-4 font-semibold">{name}</p>
          <p className="text-gray-400 text-sm mt-1">{!camOn ? "Camera Off" : "Connecting..."}</p>
        </div>
      )}
    </div>
  );
};

export default ParticipantVideo;