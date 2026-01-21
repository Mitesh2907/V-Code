import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const initialMessages = [
  { id: 'm1', user: 'Alice', text: 'Hey folks — ready to pair?', time: '10:01 AM', isMe: false },
  { id: 'm2', user: 'You', text: 'Yep! Let\'s review the PR.', time: '10:02 AM', isMe: true },
];

const ChatPanel = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState(initialMessages);

  const handleSend = (text) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: `m_${Date.now()}`,
      user: user?.name || 'You',
      text,
      time,
      isMe: true,
    };
    setMessages(prev => [...prev, newMsg]);
    // socket.io-ready: emit message here
  };

  return (
    <div className="fixed right-4 top-16 bottom-4 w-80 z-50 bg-gray-900 rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <div className="text-sm font-medium">Room Chat</div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gradient-to-b from-gray-900 to-gray-800">
        {messages.map(m => <MessageBubble key={m.id} message={m} />)}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatPanel;

