import React, { useEffect, useRef, useState, useCallback } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";

// 🔥 FINAL ICE CONFIG
const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },

    {
      urls: "turn:openrelay.metered.ca:80",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443?transport=tcp",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:relay1.expressturn.com:3478",
      username: "efO6NQ9G5K8QH3K8",
      credential: "4nXvK9e6p8y5z3h2",
    },
  ],
};

const VideoCallPanel = ({ onClose }) => {
  const { roomId } = useParams();

  const [callState, setCallState] = useState("idle");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const peersRef = useRef({});
  const streamRef = useRef(null);
  const pendingCandidatesRef = useRef({});

  /* ---------------- CREATE PEER ---------------- */
  const createPeer = useCallback((socketId) => {
    if (peersRef.current[socketId]) return peersRef.current[socketId];

    const peer = new RTCPeerConnection({
      iceServers: servers.iceServers,
      iceTransportPolicy: "relay", // 🔥 FORCE TURN
    });

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        videoSocket.emit("video-ice-candidate", {
          candidate: event.candidate,
          to: socketId,
        });
      }
    };

    peer.oniceconnectionstatechange = () => {
      console.log("ICE STATE:", socketId, peer.iceConnectionState);
    };

    peer.ontrack = (event) => {
      setRemoteStreams((prev) => {
        if (prev[socketId]) return prev;
        return {
          ...prev,
          [socketId]: event.streams[0],
        };
      });
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

    videoSocket.off();

    // 🔥 EXISTING USERS → ONLY THEY SEND OFFER
    videoSocket.on("existing-users", async (users) => {
      console.log("EXISTING USERS:", users);

      for (const id of users) {
        const peer = createPeer(id);

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        videoSocket.emit("video-offer", {
          offer,
          to: id,
        });
      }
    });

    // 🔥 NEW USER → DO NOTHING (IMPORTANT FIX)
    videoSocket.on("video-user-joined", async ({ socketId }) => {
      console.log("USER JOINED:", socketId);

      if (!streamRef.current) return;

      // ❌ NO OFFER HERE
    });

    // 🔥 RECEIVE OFFER
    videoSocket.on("video-offer", async ({ offer, sender }) => {
      let peer = peersRef.current[sender];
      if (!peer) peer = createPeer(sender);

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));

        if (pendingCandidatesRef.current[sender]) {
          for (const c of pendingCandidatesRef.current[sender]) {
            await peer.addIceCandidate(new RTCIceCandidate(c));
          }
          delete pendingCandidatesRef.current[sender];
        }

        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        videoSocket.emit("video-answer", {
          answer,
          to: sender,
        });
      } catch (err) {
        console.error("Offer error:", err);
      }
    });

    // 🔥 RECEIVE ANSWER
    videoSocket.on("video-answer", async ({ answer, sender }) => {
      const peer = peersRef.current[sender];
      if (!peer) return;

      try {
        if (!peer.currentRemoteDescription) {
          await peer.setRemoteDescription(
            new RTCSessionDescription(answer)
          );
        }
      } catch (err) {
        console.error("Answer error:", err);
      }
    });

    // 🔥 ICE CANDIDATE
    videoSocket.on("video-ice-candidate", async ({ candidate, sender }) => {
      const peer = peersRef.current[sender];
      if (!peer) return;

      try {
        if (peer.remoteDescription) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        } else {
          if (!pendingCandidatesRef.current[sender]) {
            pendingCandidatesRef.current[sender] = [];
          }
          pendingCandidatesRef.current[sender].push(candidate);
        }
      } catch (err) {
        console.error("ICE error:", err);
      }
    });

    // 🔥 USER LEFT
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

      delete pendingCandidatesRef.current[socketId];
    });

    videoSocket.on("call-ended", () => {
      leaveCall();
    });

    return () => videoSocket.removeAllListeners();
  }, [roomId, createPeer]);

  /* ---------------- AUTO JOIN ---------------- */
  useEffect(() => {
    joinCall();
  }, []);

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

      console.log("JOINING ROOM:", roomId);
      videoSocket.emit("video-join-room", { roomId });
    } catch (err) {
      console.error(err);
      toast.error("Camera permission denied");
    }
  };

  /* ---------------- LEAVE ---------------- */
  const leaveCall = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());

    Object.values(peersRef.current).forEach((p) => p.close());
    peersRef.current = {};
    pendingCandidatesRef.current = {};

    setRemoteStreams({});
    setLocalStream(null);
    setCallState("idle");

    videoSocket.emit("video-leave-room", { roomId });

    onClose && onClose();
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
    });
    setCamOn((p) => !p);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-6xl w-full mx-4 my-8 bg-gray-900 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700 text-gray-200">
          Multi User Video Call
        </div>

        <div className="p-4 bg-gray-800">
          {callState === "in-call" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <LocalVideo stream={localStream} muted />

              {Object.entries(remoteStreams).map(([id, stream]) => (
                <LocalVideo key={id} stream={stream} muted={false} />
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