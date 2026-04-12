import React, { useEffect, useRef, useState } from "react";

const LocalVideo = ({
  stream,
  muted = true,
  name = "User"
}) => {
  const videoRef = useRef(null);
  const [camOn, setCamOn] = useState(true);

  // 🔥 GET INITIALS
  const getInitials = (fullName) => {
    if (!fullName) return "U";

    const parts = fullName.trim().split(" ");

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (
      parts[0][0].toUpperCase() +
      parts[parts.length - 1][0].toUpperCase()
    );
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    // 🔥 attach stream
    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    video.onloadedmetadata = () => {
      video.play().catch(() => {});
    };

    const videoTracks = stream.getVideoTracks();

    if (videoTracks.length > 0) {
      const track = videoTracks[0];

      // 🔥 INITIAL STATE
      setCamOn(track.readyState === "live");

      // 🔥 INTERVAL CHECK (RELIABLE)
      const interval = setInterval(() => {
        setCamOn(track.readyState === "live");
      }, 500);

      return () => clearInterval(interval);
    } else {
      setCamOn(false);
    }
  }, [stream]);

  return (
    <div className="w-full h-full relative bg-gray-900 rounded overflow-hidden flex items-center justify-center">
      
      {/* VIDEO */}
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        autoPlay
        style={{ display: camOn ? "block" : "none" }}  // 🔥 FIX
        className="w-full h-full object-cover"
      />

      {/* CAMERA OFF UI */}
      {!camOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">

          {/* INITIALS */}
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
            {getInitials(name)}
          </div>

          {/* NAME */}
          <span className="text-sm mt-2">{name}</span>

          <span className="text-xs opacity-60">Camera Off</span>
        </div>
      )}
    </div>
  );
};

export default LocalVideo;