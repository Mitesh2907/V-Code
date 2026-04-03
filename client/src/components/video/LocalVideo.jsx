import React, { useEffect, useRef, useState } from "react";

const LocalVideo = ({ stream, muted = true }) => {
  const videoRef = useRef(null);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !stream) return;

    el.srcObject = stream;
    el.play().catch(() => {});

    const track = stream.getVideoTracks()[0];

    if (!track) return;

    // 🔥 REAL FIX: interval check (reliable)
    const interval = setInterval(() => {
      setCamOn(track.enabled);
    }, 300);

    return () => clearInterval(interval);
  }, [stream]);

  return (
    <div className="w-full h-full relative bg-gray-900 rounded overflow-hidden flex items-center justify-center">
      
      {/* 🎥 VIDEO */}
      {camOn ? (
        <video
          ref={videoRef}
          muted={muted}
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        />
      ) : (
        /* 👤 AVATAR */
        <div className="flex flex-col items-center justify-center text-white">
          <img
            src="https://ui-avatars.com/api/?name=User&background=random"
            alt="avatar"
            className="w-16 h-16 rounded-full mb-2"
          />
          <span className="text-sm opacity-70">Camera Off</span>
        </div>
      )}
    </div>
  );
};

export default LocalVideo;