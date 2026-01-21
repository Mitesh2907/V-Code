import React from 'react';

const GettingStarted = () => {
  const items = [
    {
      title: 'Creating Your First Room',
      content:
        'To start collaborating, click the "Create Room" button. You will receive a unique room code that you can share with others.',
    },
    {
      title: 'Joining a Room',
      content:
        'To join an existing room, click "Join Room" and enter the room code provided by the room creator.',
    },
    {
      title: 'Sharing Rooms',
      content:
        'Share your room code with collaborators. They can enter this code on the join page to access your room.',
    },
  ];

  return (
    <div>
      {items.map((item, idx) => (
        <div key={idx} className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{item.title}</h3>
          <pre className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
            {item.content}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default GettingStarted;

