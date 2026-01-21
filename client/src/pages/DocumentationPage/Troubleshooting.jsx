import React from 'react';

const Troubleshooting = () => {
  const items = [
    {
      title: 'Connection Issues',
      content:
        'If you are having trouble connecting to a room:\n' +
        '1. Check your internet connection\n' +
        '2. Refresh the page\n' +
        '3. Make sure you are using the correct room code\n' +
        '4. Try creating a new room',
    },
    {
      title: 'Editor Not Loading',
      content:
        "If the editor isn't loading properly:\n" +
        '1. Clear your browser cache\n' +
        '2. Try a different browser\n' +
        '3. Disable browser extensions\n' +
        '4. Check the browser console for errors',
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

export default Troubleshooting;

