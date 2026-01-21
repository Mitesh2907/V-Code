import React from 'react';

const FeaturesGuide = () => {
  const items = [
    {
      title: 'Real-time Editing',
      content:
        "Multiple users can edit the same file simultaneously. See each other's cursors and changes in real-time.",
    },
    {
      title: 'File Management',
      content:
        'Create, rename, and delete files and folders. Organize your project structure however you like.',
    },
    {
      title: 'Language Support',
      content:
        'V-Code supports 50+ programming languages with syntax highlighting. The editor automatically detects the language based on file extension.',
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

export default FeaturesGuide;

