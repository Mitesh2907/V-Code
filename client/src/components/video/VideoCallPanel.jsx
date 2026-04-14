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
  const [callState, setCallState] = useState("idle");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [camStatus, setCamStatus] = useState({});
  
  const storedUser = localStorage.getItem("vcode-user");
  const user = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  const peersRef = useRef({});
  const streamRef = useRef(null);

  /* ---------------- CREATE PEER ---------------- */
  const createPeer = useCallback((socketId) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];

    const peer = new RTCPeerConnection(servers);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, streamRef.current);
      });
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        videoSocket.emit("video-ice-candidate", {
          candidate: event.candidate,
          to: socketId,
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStreams((prev) => ({
        ...prev,
        [socketId]: event.streams[0],
      }));
    };

    peersRef.current[socketId] = peer;
    return peer;
  }, []);

  /* ---------------- SOCKET EVENTS (SYNCED) ---------------- */
  useEffect(() => {
    if (!roomId) return;

    videoSocket.on("video-user-joined", async ({ socketId, name, camOn }) => {
      console.log("JOINED:", socketId, name);
      // 🔥 Fix: 'undefined' string check
      const displayName = (!name || name === "undefined") ? "User" : name;
      
      setUsers((prev) => ({ ...prev, [socketId]: displayName }));
      setCamStatus((prev) => ({ ...prev, [socketId]: camOn ?? true }));

      const peer = createPeer(socketId);
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      videoSocket.emit("video-offer", { offer, to: socketId });
    });

    videoSocket.on("camera-toggle", ({ socketId, camOn }) => {
      setCamStatus((prev) => ({ ...prev, [socketId]: camOn }));
    });

    videoSocket.on("existing-users", async (usersList) => {
      usersList.forEach((u) => {
        const uName = (!u.name || u.name === "undefined") ? "User" : u.name;
        setUsers((prev) => ({ ...prev, [u.socketId]: uName }));
        setCamStatus((prev) => ({ ...prev, [u.socketId]: u.camOn }));
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

    videoSocket.on("video-user-left", ({ socketId }) => {
      if (peersRef.current[socketId]) {
        peersRef.current[socketId].close();
        delete peersRef.current[socketId];
      }
      setRemoteStreams((prev) => {
        const updated = { ...prev };
        delete updated[socketId];
        return updated;
      });
    });

    return () => {
      videoSocket.off("video-user-joined");
      videoSocket.off("camera-toggle");
      videoSocket.off("existing-users");
      videoSocket.off("video-offer");
      videoSocket.off("video-answer");
      videoSocket.off("video-ice-candidate");
      videoSocket.off("video-user-left");
    };
  }, [roomId, createPeer]);

  /* ---------------- JOIN ---------------- */
  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      setLocalStream(stream);
      setCallState("in-call");

      // 🔥 Fix: Send explicit fallback name to backend
      const fullName = user?.fullName || user?.name || "Guest";
      videoSocket.emit("video-join-room", {
        roomId,
        name: fullName
      });

    } catch (err) {
      toast.error("Camera permission denied");
    }
  };

  useEffect(() => { joinCall(); }, []);

  const toggleCam = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        const newStatus = !videoTrack.enabled;
        videoTrack.enabled = newStatus;
        setCamOn(newStatus);
        videoSocket.emit("camera-toggle", { roomId, camOn: newStatus });
      }
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setMicOn(audioTrack.enabled);
      }
    }
  };

  const leaveCall = (emit = true) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    Object.values(peersRef.current).forEach((p) => p.close());
    peersRef.current = {};
    setRemoteStreams({});
    setLocalStream(null);
    setCallState("idle");
    if (emit) {
      videoSocket.emit("video-leave-room", { roomId });
    }
    onClose && onClose(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative max-w-6xl w-full mx-4 my-8 bg-gray-900 rounded-lg overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-800">
          {callState === "in-call" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <LocalVideo stream={localStream} name={user?.fullName || "User"} camOn={camOn} muted />
              {Object.entries(remoteStreams).map(([id, stream]) => (
                <ParticipantVideo 
                  key={id} 
                  stream={stream} 
                  name={users[id] || "User"} 
                  camOn={camStatus[id] !== false} 
                />
              ))}
            </div>
          )}
        </div>
        {callState === "in-call" && (
          <VideoControls micOn={micOn} camOn={camOn} onToggleMic={toggleMic} onToggleCam={toggleCam} onLeave={leaveCall} />
        )}
      </div>
    </div>
  );
};

export default VideoCallPanel;