import React, { useEffect, useRef, useState, useCallback } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";
import ParticipantVideo from "./ParticipantVideo";

// 🔥 ICE CONFIG (Metered TURN)
const servers = {
  iceServers: [
    // 🟢 FREE GOOGLE STUN (IMPORTANT)
    { urls: "stun:stun.l.google.com:19302" },

    // existing STUN (optional)
    { urls: "stun:global.relay.metered.ca:80" },

    // TURN (fallback)
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
  // iceServers: [
  //     { urls: "stun:global.relay.metered.ca:80" },
  //     {
  //       urls: "turn:global.relay.metered.ca:80",
  //       username: "15f6cc41a2bd1b76028ffef3",
  //       credential: "NYE4C+xR1OR+v9Ev",
  //     },
  //     {
  //       urls: "turn:global.relay.metered.ca:443",
  //       username: "15f6cc41a2bd1b76028ffef3",
  //       credential: "NYE4C+xR1OR+v9Ev",
  //     },
  //   ],
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

  const user = storedUser && storedUser !== "undefined"
    ? JSON.parse(storedUser)
    : null;
  console.log("USER FROM STORAGE:", user);
  const peersRef = useRef({});
  const streamRef = useRef(null);

  /* ---------------- CREATE PEER ---------------- */
  const createPeer = useCallback((socketId) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];

    const peer = new RTCPeerConnection({
      iceServers: servers.iceServers,
      // iceTransportPolicy: "relay",
    });

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

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, streamRef.current);
      });
    }

    peersRef.current[socketId] = peer;
    return peer;
  }, []);

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    if (!roomId) return;

    // videoSocket.removeAllListeners();

    videoSocket.off("call-ended");
    videoSocket.off("existing-users");
    videoSocket.off("video-offer");
    videoSocket.off("video-answer");
    videoSocket.off("video-ice-candidate");
    videoSocket.off("video-user-left");

    videoSocket.on("video-user-joined", async ({ socketId, name, camOn }) => {
      console.log("USER JOINED:", socketId, name, camOn);

      setUsers((prev) => ({
        ...prev,
        [socketId]: name || "User",
      }));

      setCamStatus((prev) => ({
        ...prev,
        [socketId]: camOn ?? true,
      }));

      // 🔥 IMPORTANT: CREATE PEER + SEND OFFER
      const peer = createPeer(socketId);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      videoSocket.emit("video-offer", {
        offer,
        to: socketId,
      });
    });

    videoSocket.on("camera-toggle", ({ socketId, camOn }) => {
      console.log("CAM TOGGLE:", socketId, camOn);
      setCamStatus((prev) => ({
        ...prev,
        [socketId]: camOn ?? true,
      }));
    });

    const handleCallEnded = () => {
      console.log("📴 Call ended received");
      leaveCall(false);
    };

    videoSocket.on("call-ended", handleCallEnded);

    // Existing users → send offer
    videoSocket.on("existing-users", async (users) => {
      console.log("EXISTING USERS:", users);
      // 🔥 SET USERS + CAMERA STATE
      users.forEach(({ socketId, name, camOn }) => {
        setUsers((prev) => ({
          ...prev,
          [socketId]: name,
        }));

        setCamStatus((prev) => ({
          ...prev,
          [socketId]: camOn ?? true,
        }));
      });

      // 🔥 CREATE PEERS
      for (const { socketId } of users) {
        const peer = createPeer(socketId);

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        videoSocket.emit("video-offer", { offer, to: socketId });
      }
    });

    // Receive offer
    videoSocket.on("video-offer", async ({ offer, sender }) => {
      let peer = peersRef.current[sender];
      if (!peer) peer = createPeer(sender);

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      videoSocket.emit("video-answer", { answer, to: sender });
    });

    // Receive answer
    videoSocket.on("video-answer", async ({ answer, sender }) => {
      const peer = peersRef.current[sender];
      if (!peer) return;

      await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    // ICE
    videoSocket.on("video-ice-candidate", async ({ candidate, sender }) => {
      const peer = peersRef.current[sender];
      if (!peer) return;

      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // User left
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
      videoSocket.off("call-ended", handleCallEnded);
      videoSocket.off("existing-users");
      videoSocket.off("video-user-joined");
      videoSocket.off("video-offer");
      videoSocket.off("video-answer");
      videoSocket.off("video-ice-candidate");
      videoSocket.off("video-user-left");
      videoSocket.off("camera-toggle");
    };
  }, [roomId, createPeer]);

  /* ---------------- JOIN ---------------- */
  const joinCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      setLocalStream(stream);
      setCallState("in-call");



      videoSocket.emit("video-join-room", {
        roomId,
        name: user?.fullName || "User"
      });

    } catch (err) {
      toast.error("Camera permission denied");
    }
  };

  useEffect(() => {
    joinCall();
  }, []);

  /* ---------------- LEAVE ---------------- */
  const leaveCall = (emit = true) => {
    streamRef.current?.getTracks().forEach((t) => t.stop());

    Object.values(peersRef.current).forEach((p) => p.close());
    peersRef.current = {};

    setRemoteStreams({});
    setLocalStream(null);
    setCallState("idle");

    if (emit) {
      videoSocket.emit("call-ended", { roomId });
      videoSocket.emit("video-leave-room", { roomId });
    }

    onClose && onClose(true);
  };

  /* ---------------- TOGGLE ---------------- */
  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMicOn((p) => !p);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => {
      const newState = !t.enabled;
      t.enabled = newState;

      // 🔥 FIX: LOCAL camStatus update
      setCamStatus((prev) => ({
        ...prev,
        [videoSocket.id]: newState,
      }));

      videoSocket.emit("camera-toggle", {
        roomId,
        camOn: newState,
      });
    });

    setCamOn((p) => !p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-6xl w-full mx-4 my-8 bg-gray-900 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700 text-gray-200">
          Video Call
        </div>

        <div className="p-4 bg-gray-800">
          {callState === "in-call" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">


              {/* LOCAL */}
              <LocalVideo
                stream={localStream}
                muted
                name={user?.fullName || "User"}
                camOn={camOn}
              />

              {/* REMOTE */}
              {Object.entries(remoteStreams).map(([id, stream]) => {
                console.log("RENDER:", id, users[id], camStatus[id]);

                return (
                  <ParticipantVideo
                    key={id}
                    stream={stream}
                    name={users[id] || "User"}
                    camOn={camStatus[id] ?? true}
                  />
                );
              })}

            </div>
          )}
        </div>

        {callState === "in-call" && (
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