import React, { useEffect, useRef, useState, useCallback } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";

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

    videoSocket.on("video-user-joined", ({ socketId, name }) => {
      setUsers((prev) => ({
        ...prev,
        [socketId]: name,
      }));
    });

    videoSocket.on("camera-toggle", ({ socketId, camOn }) => {
      setCamStatus((prev) => ({
        ...prev,
        [socketId]: camOn,
      }));
    });

    const handleCallEnded = () => {
      console.log("📴 Call ended received");
      leaveCall(false);
    };

    videoSocket.on("call-ended", handleCallEnded);

    // Existing users → send offer
    videoSocket.on("existing-users", async (users) => {
      for (const id of users) {
        const peer = createPeer(id);

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        videoSocket.emit("video-offer", { offer, to: id });
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
        name: "Mitesh Nayi",
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
      t.enabled = !t.enabled;

      // SEND CAMERA STATE
      videoSocket.emit("camera-toggle", {
        roomId,
        camOn: t.enabled,
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
                name="Mitesh Nayi"
              />

              {/* REMOTE */}
              {Object.entries(remoteStreams).map(([id, stream]) => (
                <LocalVideo
                  key={id}
                  stream={stream}
                  name={users[id] || "User"}
                  muted={false}
                 camOn={camStatus[id] ?? true}
                />
              ))}

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