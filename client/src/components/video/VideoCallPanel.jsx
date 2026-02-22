import React, { useEffect, useRef, useState } from "react";
import VideoControls from "./VideoControls";
import LocalVideo from "./LocalVideo";
import toast from "react-hot-toast";
import videoSocket from "../../configs/videoSocket";
import { useParams } from "react-router-dom";

const servers = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" }
  ]
};

const VideoCallPanel = ({ onClose }) => {
  const { roomId } = useParams();

  const [callState, setCallState] = useState("idle");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const peerRef = useRef(null);
  const streamRef = useRef(null);

  /* ---------------- CREATE PEER ---------------- */
  const createPeer = (targetSocketId) => {
    const peer = new RTCPeerConnection(servers);

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        videoSocket.emit("video-ice-candidate", {
          candidate: event.candidate,
          target: targetSocketId,
        });
      }
    };

    peer.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    streamRef.current.getTracks().forEach((track) => {
      peer.addTrack(track, streamRef.current);
    });

    peerRef.current = peer;
    return peer;
  };

  /* ---------------- SOCKET EVENTS ---------------- */
  useEffect(() => {
    if (!roomId) return;

    videoSocket.on("video-user-joined", async ({ socketId }) => {
      const peer = createPeer(socketId);

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      videoSocket.emit("video-offer", {
        offer,
        target: socketId,
      });
    });

    videoSocket.on("video-offer", async ({ offer, sender }) => {
      const peer = createPeer(sender);

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      videoSocket.emit("video-answer", {
        answer,
        target: sender,
      });
    });

    videoSocket.on("video-answer", async ({ answer }) => {
      await peerRef.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    videoSocket.on("video-ice-candidate", async ({ candidate }) => {
      try {
        await peerRef.current.addIceCandidate(
          new RTCIceCandidate(candidate)
        );
      } catch (err) {
        console.error("ICE error", err);
      }
    });

    return () => {
      videoSocket.off("video-user-joined");
      videoSocket.off("video-offer");
      videoSocket.off("video-answer");
      videoSocket.off("video-ice-candidate");
    };
  }, [roomId]);

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
      toast.error("Camera/Mic access denied");
      setCallState("idle");
    }
  };

  /* ---------------- LEAVE CALL ---------------- */
  const leaveCall = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
    setCallState("idle");
    onClose?.();
  };

  /* ---------------- TOGGLE ---------------- */
  const toggleMic = () => {
    streamRef.current?.getAudioTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setMicOn((prev) => !prev);
  };

  const toggleCam = () => {
    streamRef.current?.getVideoTracks().forEach((t) => {
      t.enabled = !t.enabled;
    });
    setCamOn((prev) => !prev);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={leaveCall} />

      <div className="relative max-w-6xl w-full mx-4 my-8 bg-gray-900 rounded-lg shadow-xl overflow-hidden flex flex-col">

        <div className="p-3 border-b border-gray-700 text-gray-200">
          Real WebRTC Call
        </div>

        <div className="p-4 bg-gray-800">

          {callState === "idle" && (
            <button
              onClick={joinCall}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Join Call
            </button>
          )}

          {callState === "in-call" && (
            <div className="grid grid-cols-2 gap-3">
              <LocalVideo stream={localStream} muted />
              {remoteStream && (
                <LocalVideo stream={remoteStream} muted={false} />
              )}
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
