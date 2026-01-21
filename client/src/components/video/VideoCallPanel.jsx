import React, { useEffect, useRef, useState } from 'react';
import ParticipantVideo from './ParticipantVideo';
import VideoControls from './VideoControls';
import LocalVideo from './LocalVideo';
import toast from 'react-hot-toast';

// Frontend-only demo: This component provides a UI-level video call experience.
// Real multi-user calls require backend signaling and peer connections (not included).

const mockParticipants = [
  { id: '2', name: 'Alice', avatar: 'https://ui-avatars.com/api/?name=Alice' },
  { id: '3', name: 'Bob', avatar: 'https://ui-avatars.com/api/?name=Bob' },
  { id: '4', name: 'Eve', avatar: 'https://ui-avatars.com/api/?name=Eve' },
];

const VideoCallPanel = ({ onClose }) => {
  const [callState, setCallState] = useState('idle'); // idle | joining | in-call
  const [localStream, setLocalStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const streamRef = useRef(null);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      stopLocalTracks();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopLocalTracks = () => {
    try {
      const s = streamRef.current;
      if (s) {
        s.getTracks().forEach(t => {
          try { t.stop(); } catch (e) {}
        });
      }
    } catch (err) {}
    setLocalStream(null);
    streamRef.current = null;
  };

  const joinCall = async () => {
    setCallState('joining');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = s;
      setLocalStream(s);
      setMicOn(!!s.getAudioTracks().find(t => t.enabled !== undefined ? t.enabled : true));
      setCamOn(!!s.getVideoTracks().find(t => t.enabled !== undefined ? t.enabled : true));
      setCallState('in-call');
    } catch (err) {
      console.error('getUserMedia failed', err);
      toast.error('Unable to access camera/microphone');
      setCallState('idle');
    }
  };

  const leaveCall = () => {
    stopLocalTracks();
    setCallState('idle');
    if (onClose) onClose();
  };

  const toggleMic = () => {
    const s = streamRef.current;
    if (!s) return setMicOn(prev => !prev);
    s.getAudioTracks().forEach(t => (t.enabled = !t.enabled));
    setMicOn(prev => !prev);
  };

  const toggleCam = () => {
    const s = streamRef.current;
    if (!s) return setCamOn(prev => !prev);
    s.getVideoTracks().forEach(t => (t.enabled = !t.enabled));
    setCamOn(prev => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-auto">
      <div className="absolute inset-0 bg-black/60" onClick={leaveCall} />
      <div className="relative max-w-6xl w-full mx-4 my-8 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <div className="text-sm font-medium text-gray-100">Video Call</div>
          <div className="text-xs text-gray-400">Frontend-only demo — signaling required for real calls</div>
        </div>

        <div className="p-4 bg-gray-800">
          {callState === 'idle' && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-sm text-gray-300 mb-4">You are about to join a frontend-only demo call.</div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={joinCall}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  Join Call
                </button>
                <button
                  onClick={leaveCall}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {callState === 'joining' && (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-gray-300">Requesting camera & microphone...</div>
            </div>
          )}

          {callState === 'in-call' && (
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1 row-span-1 bg-gray-900 rounded overflow-hidden">
                <div className="text-xs text-gray-400 px-2 py-1 border-b border-gray-700">You (local)</div>
                <div className="h-48 bg-black">
                  <LocalVideo stream={localStream} muted />
                </div>
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-3">
                {mockParticipants.map(p => (
                  <ParticipantVideo key={p.id} name={p.name} avatar={p.avatar} muted={false} />
                ))}
              </div>
            </div>
          )}
        </div>

        {callState === 'in-call' && (
          <VideoControls
            micOn={micOn}
            camOn={camOn}
            onToggleMic={toggleMic}
            onToggleCam={toggleCam}
            onLeave={leaveCall}
          />
        )}
      </div>
    </div>
  );
};

export default VideoCallPanel;

