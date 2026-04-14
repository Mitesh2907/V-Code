import React, { useEffect, useRef, useState, useCallback } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";
import ParticipantVideo from "./ParticipantVideo";

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

const VideoCallPanel = ({ onClose }) => {
  const { roomId } = useParams();
  const [users, setUsers] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [camOn, setCamOn] = useState(true);
  const [camStatus, setCamStatus] = useState({});
  const peersRef = useRef({});
  const streamRef = useRef(null);

  const createPeer = useCallback((socketId) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];
    const peer = new RTCPeerConnection(servers);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => peer.addTrack(track, streamRef.current));
    }
    peer.onicecandidate = (e) => {
      if (e.candidate) videoSocket.emit("video-ice-candidate", { candidate: e.candidate, to: socketId });
    };
    peer.ontrack = (e) => {
      setRemoteStreams(prev => ({ ...prev, [socketId]: e.streams[0] }));
    };
    peersRef.current[socketId] = peer;
    return peer;
  }, []);

  useEffect(() => {
    videoSocket.on("video-user-joined", async ({ socketId, name, camOn }) => {
      setUsers(p => ({ ...p, [socketId]: name || "User" }));
      setCamStatus(p => ({ ...p, [socketId]: camOn }));
      const peer = createPeer(socketId);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      videoSocket.emit("video-offer", { offer, to: socketId });
    });

    videoSocket.on("video-offer", async ({ offer, sender }) => {
      let peer = peersRef.current[sender] || createPeer(sender);
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      videoSocket.emit("video-answer", { answer, to: sender });
    });

    videoSocket.on("video-answer", async ({ answer, sender }) => {
      const peer = peersRef.current[sender];
      if (peer) await peer.setRemoteDescription(new RTCSessionDescription(answer));
    });

    videoSocket.on("video-ice-candidate", async ({ candidate, sender }) => {
      const peer = peersRef.current[sender];
      if (peer) await peer.addIceCandidate(new RTCIceCandidate(candidate));
    });

    videoSocket.on("camera-toggle", ({ socketId, camOn }) => {
      setCamStatus(p => ({ ...p, [socketId]: camOn }));
    });

    return () => {
      videoSocket.off("video-user-joined");
      videoSocket.off("video-offer");
      videoSocket.off("camera-toggle");
    };
  }, [roomId, createPeer]);

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setLocalStream(stream);
      const storedUser = JSON.parse(localStorage.getItem("vcode-user") || "{}");
      videoSocket.emit("video-join-room", { roomId, name: storedUser.fullName || "User" });
    } catch (err) { toast.error("Camera access failed"); }
  };
  useEffect(() => { joinCall(); }, []);

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
        <LocalVideo stream={localStream} name="Me" camOn={camOn} muted />
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <ParticipantVideo 
            key={`${id}-${camStatus[id]}`} // 🔥 Unique key force re-render
            stream={stream} 
            name={users[id] || "User"} 
            camOn={camStatus[id] !== false} 
          />
        ))}
      </div>
    </div>
  );
};

export default VideoCallPanel;