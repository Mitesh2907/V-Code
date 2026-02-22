import React, { useState } from 'react';
import Button from '../../components/common/Button/Button';
import { useTheme } from '../../contexts/ThemeContext';
import GettingStarted from './GettingStarted';
import FeaturesGuide from './FeaturesGuide';
import KeyboardShortcuts from './KeyboardShortcuts';
import Troubleshooting from './Troubleshooting';

const DocumentationPage = () => {
  const { isDarkMode } = useTheme();
  const [activeSection, setActiveSection] = useState('getting-started');

  const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'features', title: 'Features Guide' },
    { id: 'keyboard-shortcuts', title: 'Keyboard Shortcuts' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
  ];

  const renderActive = () => {
    switch (activeSection) {
      case 'features':
        return <FeaturesGuide />;
      case 'keyboard-shortcuts':
        return <KeyboardShortcuts />;
      case 'troubleshooting':
        return <Troubleshooting />;
      case 'getting-started':
      default:
        return <GettingStarted />;
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6">
            V-Code{' '}
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
              Documentation
            </span>
          </h1>
          <p className="text-xl text-gray-500 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Everything you need to know to get started and make the most of V-Code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = '/create')}
              className="px-8"
              leftIcon="🚀"
            >
              Try It Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => (window.location.href = 'https://github.com')}
              className="px-8"
              leftIcon="📖"
            >
              GitHub Repository
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-xl p-6 dark:bg-gray-800/30 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contents</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-primary-500/20 dark:text-primary-400 dark:border-primary-500/30'
                        : 'text-gray-500 dark:text-gray-400 hover:text-blue-700 hover:bg-blue-50 dark:hover:text-white dark:hover:bg-gray-700/50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {sections.find(s => s.id === activeSection)?.title || 'Documentation'}
              </h2>
              <div className="space-y-8">{renderActive()}</div>
            </div>

            {/* Support Section */}
            <div className="mt-12 bg-white rounded-2xl border border-gray-200 p-8 dark:bg-gradient-to-r dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Need More Help?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: '💬',
                    title: 'Community Support',
                    text: 'Ask questions and get help from our community',
                    action: 'Join Community',
                  },
                  {
                    icon: '📧',
                    title: 'Email Support',
                    text: 'Get direct support from our team',
                    action: 'Contact Support',
                  },
                  {
                    icon: '🐛',
                    title: 'Report Issues',
                    text: 'Found a bug? Report it on GitHub',
                    action: 'GitHub Issues',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="text-center p-6 bg-gray-800/50 rounded-xl"
                  >
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{item.text}</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      {item.action}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
