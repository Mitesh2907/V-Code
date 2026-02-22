import React from 'react';

const MessageBubble = ({ message }) => {
  const isMe = message.isMe;

  // ✅ safe time handling
  const time =
    message.time ||
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`${
          isMe
            ? 'bg-blue-600 text-white'
            : 'bg-gray-700 text-gray-100'
        } max-w-xs rounded-lg p-2`}
      >
        <div className="text-xs text-gray-200 font-medium">
          {message.user}
        </div>

        <div className="text-sm mt-1">
          {message.text}
        </div>

        <div className="text-xs text-gray-400 mt-1 text-right">
          {time}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
