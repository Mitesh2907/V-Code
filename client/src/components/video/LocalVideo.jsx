import React, { useEffect, useRef, useState } from "react";

const LocalVideo = ({ stream, muted = true }) => {
  const videoRef = useRef(null);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (stream) {
      // 🔥 ALWAYS reattach stream
      video.srcObject = stream;

      video.onloadedmetadata = () => {
        video.play().catch(() => {});
      };

      const track = stream.getVideoTracks()[0];

      if (track) {
        // 🔥 FIX: use interval (reliable)
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
      
      {camOn ? (
        <video
          ref={videoRef}
          muted={muted}
          playsInline
          autoPlay
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-white">
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