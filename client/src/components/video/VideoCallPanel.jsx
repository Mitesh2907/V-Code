import React, { useEffect, useRef, useState, useCallback } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";
import ParticipantVideo from "./ParticipantVideo";

const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:global.relay.metered.ca:80" },
    {
      urls: "turn:global.relay.metered.ca:80",
      username: "15f6cc41a2bd1b76028ffef3",
      credential: "NYE4C+xR1OR+v9Ev",
    },
    {
      urls: "turn:global.relay.metered.ca:443",
      username: "15f6cc41a2bd1b76028ffef3",
      credential: "NYE4C+xR1OR+v9Ev",
    },
  ],
};

const VideoCallPanel = ({ onClose }) => {
  const { roomId } = useParams();
  const [users, setUsers] = useState({});
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [camStatus, setCamStatus] = useState({});
  
  const storedUser = localStorage.getItem("vcode-user");
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const peersRef = useRef({});
  const streamRef = useRef(null);

  const createPeer = useCallback((socketId) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];
    const peer = new RTCPeerConnection(servers);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => peer.addTrack(track, streamRef.current));
    }

    peer.onicecandidate = (e) => {
      if (e.candidate) videoSocket.emit("video-ice-candidate", { candidate: e.candidate, to: socketId });
    };

    peer.ontrack = (e) => {
      setRemoteStreams((prev) => ({ ...prev, [socketId]: e.streams[0] }));
    };

    peersRef.current[socketId] = peer;
    return peer;
  }, []);

  useEffect(() => {
    if (!roomId) return;

    videoSocket.on("video-user-joined", async ({ socketId, name, camOn }) => {
      setUsers((prev) => ({ ...prev, [socketId]: name || "User" }));
      setCamStatus((prev) => ({ ...prev, [socketId]: camOn }));
      const peer = createPeer(socketId);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      videoSocket.emit("video-offer", { offer, to: socketId });
    });

    videoSocket.on("existing-users", async (usersList) => {
      usersList.forEach((u) => {
        setUsers((p) => ({ ...p, [u.socketId]: u.name }));
        setCamStatus((p) => ({ ...p, [u.socketId]: u.camOn }));
      });
      for (const u of usersList) {
        const peer = createPeer(u.socketId);
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        videoSocket.emit("video-offer", { offer, to: u.socketId });
      }
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
      setCamStatus((prev) => ({ ...prev, [socketId]: camOn }));
    });

    videoSocket.on("video-user-left", ({ socketId }) => {
      if (peersRef.current[socketId]) { peersRef.current[socketId].close(); delete peersRef.current[socketId]; }
      setRemoteStreams((p) => { const n = {...p}; delete n[socketId]; return n; });
    });

    return () => {
      videoSocket.off("video-user-joined");
      videoSocket.off("existing-users");
      videoSocket.off("video-offer");
      videoSocket.off("video-answer");
      videoSocket.off("video-ice-candidate");
      videoSocket.off("camera-toggle");
      videoSocket.off("video-user-left");
    };
  }, [roomId, createPeer]);

  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setLocalStream(stream);
      videoSocket.emit("video-join-room", { roomId, name: user?.fullName || "User" });
    } catch (err) { toast.error("Camera access denied"); }
  };

  useEffect(() => { joinCall(); }, []);

  const toggleCam = () => {
    if (streamRef.current) {
      const track = streamRef.current.getVideoTracks()[0];
      track.enabled = !track.enabled;
      setCamOn(track.enabled);
      videoSocket.emit("camera-toggle", { roomId, camOn: track.enabled });
    }
  };

  const leaveCall = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    onClose && onClose(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="w-full max-w-6xl p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <LocalVideo stream={localStream} name={user?.fullName || "Me"} camOn={camOn} muted />
          {Object.entries(remoteStreams).map(([id, stream]) => (
            <ParticipantVideo 
              key={id} 
              stream={stream} 
              name={users[id] || "User"} 
              camOn={stream && stream.active && camStatus[id] !== false} 
            />
          ))}
        </div>
        <VideoControls micOn={micOn} camOn={camOn} onToggleMic={() => {
           const t = streamRef.current.getAudioTracks()[0]; t.enabled = !t.enabled; setMicOn(t.enabled);
        }} onToggleCam={toggleCam} onLeave={leaveCall} />
      </div>
    </div>
  );
};

export default VideoCallPanel;