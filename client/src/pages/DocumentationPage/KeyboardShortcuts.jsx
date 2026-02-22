import React from 'react';

const KeyboardShortcuts = () => {
  const items = [
    {
      title: 'Editor Shortcuts',
      content:
        '• Ctrl+S / Cmd+S: Save current file\n' +
        '• Ctrl+F / Cmd+F: Find in file\n' +
        '• Ctrl+Z / Cmd+Z: Undo\n' +
        '• Ctrl+Y / Cmd+Y: Redo\n' +
        '• Ctrl+/ / Cmd+/: Toggle comment',
    },
    {
      title: 'Navigation Shortcuts',
      content:
        '• Ctrl+Shift+F / Cmd+Shift+F: Open file explorer\n' +
        '• Ctrl+P / Cmd+P: Quick file search\n' +
        '• Ctrl+` / Cmd+`: Open terminal (coming soon)',
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

export default KeyboardShortcuts;

