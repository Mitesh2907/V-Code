import React, { useEffect, useRef, useState } from "react";

const LocalVideo = ({ stream, muted = true }) => {
  const videoRef = useRef(null);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      // 🔥 ALWAYS attach stream ONCE
      video.srcObject = stream;

      // 🔥 play directly (no metadata dependency)
      video.play().catch(() => {});

      const track = stream.getVideoTracks()[0];

      if (track) {
        const interval = setInterval(() => {
          setCamOn(track.enabled);
        }, 300);

        return () => clearInterval(interval);
      }
    } else {
      video.srcObject = null;
    }
  }, [stream]);

  return (
    <div className="w-full h-full relative bg-gray-900 rounded overflow-hidden flex items-center justify-center">
      
      {/* 🔥 VIDEO ALWAYS RENDER */}
      <video
        ref={videoRef}
        muted={muted}
        playsInline
        autoPlay
        className={`w-full h-full object-cover ${camOn ? "block" : "hidden"}`}
      />

      {/* 🔥 CAMERA OFF UI OVERLAY */}
      {!camOn && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-lg">
            U
          </div>
          <span className="text-sm opacity-70 mt-2">Camera Off</span>
        </div>
      )}
    </div>
  );
};

export default LocalVideo;