import React, { useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import socket from "../../configs/socket";
import { useParams } from "react-router-dom";
import api from "../../configs/api";

const ChatPanel = ({ onClose }) => {
  const { user } = useAuth();
  const { roomId } = useParams();

  const [messages, setMessages] = useState([]);

  /* ---------------- LOAD CHAT HISTORY ---------------- */
  useEffect(() => {
    if (!roomId || !user) return;

    api
      .get(`/chat/${roomId}`)
      .then(({ data }) => {
        const formatted = data.messages.map((m) => ({
          id: m.id,
          user: m.fullName, // ✅ from JOIN users table
          text: m.message,
          isMe: m.user_id === user.id,
          time: new Date(m.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setMessages(formatted);
      })
      .catch(() => {
        console.log("Failed to load chat history");
      });
  }, [roomId, user]);

  useEffect(() => {
  if (!roomId) return;

  const markSeen = async () => {
    try {
      await api.patch(`/chat/seen/${roomId}`);
    } catch (err) {
      console.log("Mark seen failed");
    }
  };

  markSeen();
}, [roomId]);


  /* ---------------- JOIN ROOM ---------------- */
  useEffect(() => {
    if (!roomId) return;
    socket.emit("join-room", { roomId });
  }, [roomId]);

  /* ---------------- RECEIVE MESSAGE ---------------- */
  useEffect(() => {
    if (!user) return;

    const handleReceive = (message) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          user: message.user.fullName,
          text: message.text,
          isMe: message.user.id === user.id,
          time: message.time,
        },
      ]);
    };

    socket.on("receive-message", handleReceive);

    return () => {
      socket.off("receive-message", handleReceive);
    };
  }, [user]);

  /* ---------------- SEND MESSAGE ---------------- */
  const handleSend = (text) => {
    if (!roomId || !user || !text.trim()) return;

    socket.emit("send-message", {
      roomId,
      message: {
        text,
        userId: user.id, // ✅ IMPORTANT
        user: {
          id: user.id,
          fullName: user.fullName,
        },
      },
    });
  };

  return (
    <div className="fixed right-4 top-16 bottom-4 w-80 z-50 bg-gray-900 rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* HEADER */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <div className="text-sm font-medium">Room Chat</div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gradient-to-b from-gray-900 to-gray-800">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      {/* INPUT */}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPanel;
