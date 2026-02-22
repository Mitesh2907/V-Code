import React, { useEffect, useRef } from 'react';

// LocalVideo: attaches a MediaStream to a <video> element for preview.
// Frontend-only demo: replace with real remote <video> elements when integrating WebRTC.
const LocalVideo = ({ stream, muted = true }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (stream) {
      el.srcObject = stream;
      el.play().catch(() => {});
    } else {
      el.srcObject = null;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      muted={muted}
      playsInline
      autoPlay
      className="w-full h-full object-cover bg-black rounded"
    />
  );
};

export default LocalVideo;

