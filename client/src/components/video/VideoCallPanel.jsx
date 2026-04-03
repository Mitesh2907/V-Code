import React, { useEffect, useRef, useState, useCallback } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
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

    videoSocket.off("video-user-joined");
    videoSocket.off("video-offer");
    videoSocket.off("video-answer");
    videoSocket.off("video-ice-candidate");
    videoSocket.off("video-user-left");

    videoSocket.on("video-user-joined", async ({ socketId }) => {
      const peer = createPeer(socketId);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      videoSocket.emit("video-offer", {
        offer,
        to: socketId,
      });
    });

    videoSocket.on("video-offer", async ({ offer, sender }) => {
      const peer = createPeer(sender);

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      videoSocket.emit("video-answer", {
        answer,
        to: sender,
      });
    });

    videoSocket.on("video-answer", async ({ answer, sender }) => {
      const peer = peersRef.current[sender];
      if (peer) {
        await peer.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      }
    });

    videoSocket.on("video-ice-candidate", async ({ candidate, sender }) => {
      try {
        const peer = peersRef.current[sender];
        if (peer) {
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error("ICE error:", err);
      }
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
      videoSocket.off("video-offer");
      videoSocket.off("video-answer");
      videoSocket.off("video-ice-candidate");
      videoSocket.off("video-user-left");
    };
  }, [roomId, createPeer]);

  /* ---------------- AUTO JOIN ---------------- */
  useEffect(() => {
    if (autoJoin && callState === "idle") {
      joinCall();
    }
  }, [autoJoin, callState]);

  /* ---------------- JOIN CALL ---------------- */
  const joinCall = async () => {
    setCallState("joining");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      setLocalStream(stream);

      videoSocket.emit("video-join-room", { roomId });

      setCallState("in-call");
    } catch (err) {
      console.error(err);
      toast.error("Camera/Mic access denied");
      setCallState("idle");
    }
  };

  /* ---------------- LEAVE CALL ---------------- */
  const leaveCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }

    Object.values(peersRef.current).forEach((peer) => peer.close());
    peersRef.current = {};

    setLocalStream(null);
    setRemoteStreams({});
    setCallState("idle");

    videoSocket.emit("video-leave-room", { roomId });

    if (onClose) onClose();
  };

  /* ---------------- TOGGLE ---------------- */
  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
    }
    setMicOn((prev) => !prev);
  };

  const toggleCam = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach((t) => {
        t.enabled = !t.enabled;
      });
    }
    setCamOn((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={leaveCall}
      />

      <div className="relative max-w-6xl w-full mx-4 my-8 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">
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