import React, { useState } from 'react';
import Button from '../common/Button/Button';

const ChatInput = ({ onSend, placeholder = 'Type a message...' }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <div className="p-3 border-t border-gray-700 bg-gray-800 flex items-center space-x-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder={placeholder}
        className="flex-1 bg-gray-900/60 text-sm p-2 rounded outline-none"
      />
      <Button variant="primary" size="sm" onClick={handleSend}>
        Send
      </Button>
    </div>
  );
};

export default ChatInput;

