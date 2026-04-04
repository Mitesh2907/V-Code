import React, { useEffect, useRef, useState, useCallback } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";

const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
  ],
};

const VideoCallPanel = ({ onClose, autoJoin }) => {
  const { roomId } = useParams();

  const [callState, setCallState] = useState("idle");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState({});
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const peersRef = useRef({});
  const streamRef = useRef(null);

  /* ---------------- CREATE PEER ---------------- */
  const createPeer = useCallback((socketId) => {
    if (peersRef.current[socketId]) {
      return peersRef.current[socketId]; // 🔥 prevent duplicate
    }

    const peer = new RTCPeerConnection(servers);

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        videoSocket.emit("video-ice-candidate", {
          candidate: event.candidate,
          to: socketId,
        });
      }
    };

    peer.ontrack = (event) => {
      console.log("REMOTE STREAM RECEIVED");

      setRemoteStreams((prev) => ({
        ...prev,
        [socketId]: event.streams[0],
      }));
    };

    // 🔥 IMPORTANT FIX (delay track add)
    setTimeout(() => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          peer.addTrack(track, streamRef.current);
        });
      }
    }, 200);

    peersRef.current[socketId] = peer;
    return peer;
  }, []);

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    if (!roomId) return;

    videoSocket.off();

    /* 🔥 EXISTING USERS */
    videoSocket.on("existing-users", async (users) => {
      for (const id of users) {
        if (peersRef.current[id]) continue;

        const peer = createPeer(id);

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);

        videoSocket.emit("video-offer", {
          offer,
          to: id,
        });
      }
    });

    /* 🔥 NEW USER */
    videoSocket.on("video-user-joined", async ({ socketId }) => {
      if (!streamRef.current) return;
      if (peersRef.current[socketId]) return;

      const peer = createPeer(socketId);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      videoSocket.emit("video-offer", {
        offer,
        to: socketId,
      });
    });

    /* 🔥 RECEIVE OFFER */
    videoSocket.on("video-offer", async ({ offer, sender }) => {
      let peer = peersRef.current[sender];

      if (!peer) {
        peer = createPeer(sender);
      }

      // 🔥 prevent invalid state
      if (peer.signalingState !== "stable") return;

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      videoSocket.emit("video-answer", {
        answer,
        to: sender,
      });
    });

    /* 🔥 RECEIVE ANSWER (FIXED) */
    videoSocket.on("video-answer", async ({ answer, sender }) => {
      const peer = peersRef.current[sender];
      if (!peer) return;

      // 🔥 MAIN FIX
      if (peer.signalingState !== "have-local-offer") {
        console.log("Skipping invalid answer");
        return;
      }

      await peer.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    /* 🔥 ICE */
    videoSocket.on("video-ice-candidate", async ({ candidate, sender }) => {
      const peer = peersRef.current[sender];
      if (!peer) return;

      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.log("ICE error", err);
      }
    });

    /* 🔥 USER LEFT */
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

    videoSocket.on("call-ended", () => {
      leaveCall();
    });

    return () => videoSocket.off();
  }, [roomId, createPeer]);

  /* ---------------- JOIN ---------------- */
  const joinCall = async () => {
    setCallState("joining");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      setLocalStream(stream);

      setCallState("in-call");

      videoSocket.emit("video-join-room", { roomId });
    } catch {
      toast.error("Camera permission denied");
      setCallState("idle");
    }
  };

  /* ---------------- LEAVE ---------------- */
  const leaveCall = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());

    Object.values(peersRef.current).forEach((p) => p.close());
    peersRef.current = {};

    setRemoteStreams({});
    setLocalStream(null);
    setCallState("idle");

    videoSocket.emit("video-leave-room", { roomId });

    onClose && onClose();
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative max-w-6xl w-full mx-4 my-8 bg-gray-900 rounded-lg overflow-hidden flex flex-col">
        <div className="p-3 border-b border-gray-700 text-gray-200">
          Multi User Video Call
        </div>

        <div className="p-4 bg-gray-800">
          {callState === "idle" && !autoJoin && (
            <button
              onClick={joinCall}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Join Call
            </button>
          )}

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
            onToggleMic={() => {}}
            onToggleCam={() => {}}
            onLeave={leaveCall}
          />
        )}
      </div>
    </div>
  );
};

export default VideoCallPanel;