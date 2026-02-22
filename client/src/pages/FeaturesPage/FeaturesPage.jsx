import React from 'react';
import Button from '../../components/common/Button/Button';
import { useTheme } from '../../contexts/ThemeContext';

const FeaturesPage = () => {
  const { isDarkMode } = useTheme();
  const features = [
    {
      category: 'Real-time Collaboration',
      items: [
        {
          title: 'Live Cursor Tracking',
          description: 'See where your teammates are typing in real-time with colored cursors.',
          icon: '🎯',
        },
        {
          title: 'Simultaneous Editing',
          description: 'Multiple users can edit the same file simultaneously without conflicts.',
          icon: '👥',
        },
        {
          title: 'Instant Updates',
          description: 'Changes appear instantly for all participants with no noticeable delay.',
          icon: '⚡',
        },
      ],
    },
    {
      category: 'Code Editor Features',
      items: [
        {
          title: 'Syntax Highlighting',
          description: 'Support for 50+ programming languages with proper syntax highlighting.',
          icon: '🌈',
        },
        {
          title: 'Auto-completion',
          description: 'Intelligent code suggestions as you type for faster development.',
          icon: '💡',
        },
        {
          title: 'Multiple File Support',
          description: 'Create and manage multiple files and folders within your workspace.',
          icon: '📁',
        },
      ],
    },
    {
      category: 'Team Collaboration',
      items: [
        {
          title: 'Room Management',
          description: 'Create private or public rooms with unique access codes.',
          icon: '🔐',
        },
        {
          title: 'User Presence',
          description: 'See who\'s online and actively coding in the room.',
          icon: '👤',
        },
        {
          title: 'Shareable Links',
          description: 'Generate shareable links for quick room access.',
          icon: '🔗',
        },
      ],
    },
    {
      category: 'Productivity Tools',
      items: [
        {
          title: 'Auto-save',
          description: 'All changes are automatically saved, never lose your work.',
          icon: '💾',
        },
        {
          title: 'Version History',
          description: 'Access previous versions of your code to track changes.',
          icon: '🕰️',
        },
        {
          title: 'Export Options',
          description: 'Export your code as files or share as GitHub gists.',
          icon: '📤',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 ${isDarkMode ? '' : '!bg-transparent !shadow-none !backdrop-blur-none'}`}>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white mb-6">
  Built for Modern Teams,
  <br />
  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-extrabold">
    Packed With Powerful Features
  </span>
</h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto mb-10">
            Everything you need to collaborate effectively on code. Built for developers, by developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/create'}
              className="px-8"
              leftIcon="🚀"
            >
              Start Coding Free
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/join'}
              className="px-8"
              leftIcon="🔗"
            >
              Join a Room
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-16">
          {features.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-200 dark:bg-gray-800/50 dark:border-gray-700 transition-colors"
                  >
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20 bg-white rounded-2xl border border-gray-200 p-8 dark:bg-gray-800/30 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            V-Code vs Traditional Tools
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Feature</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">V-Code</th>
                  <th className="text-left py-4 px-4 text-gray-300 font-semibold">Other Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4 text-gray-400">Setup Time</td>
                  <td className="py-4 px-4 text-green-400">Instant</td>
                  <td className="py-4 px-4 text-gray-400">Minutes to hours</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4 text-gray-400">Real-time Collaboration</td>
                  <td className="py-4 px-4 text-green-400">Built-in</td>
                  <td className="py-4 px-4 text-gray-400">Third-party plugins</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4 text-gray-400">Browser-based</td>
                  <td className="py-4 px-4 text-green-400">Yes</td>
                  <td className="py-4 px-4 text-gray-400">Installation required</td>
                </tr>
                <tr className="border-b border-gray-700/50">
                  <td className="py-4 px-4 text-gray-400">Free Tier</td>
                  <td className="py-4 px-4 text-green-400">Unlimited rooms</td>
                  <td className="py-4 px-4 text-gray-400">Limited features</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Experience These Features?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already collaborating with V-Code.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/create'}
            className="px-8 py-4 text-lg"
            leftIcon="🚀"
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;