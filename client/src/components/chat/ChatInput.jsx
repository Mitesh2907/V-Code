import React, { useState } from 'react';
import Button from '../common/Button/Button';

const ChatInput = ({ onSend, placeholder = 'Type a message...' }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    // ✅ Enter = send
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t border-gray-700 bg-gray-800 flex items-center space-x-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none bg-gray-900/60 text-sm p-2 rounded outline-none"
      />

      <Button
        variant="primary"
        size="sm"
        onClick={handleSend}
        disabled={!text.trim()}   // ✅ disable when empty
      >
        Send
      </Button>
    </div>
  );
};

export default ChatInput;
