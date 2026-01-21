import React from 'react';
import { Code, Users, Zap, Shield, ArrowRight, Play, Globe, Lock, Terminal, Clock, Cpu, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Code,
      title: 'Real-time Editing',
      description: 'See teammates\' cursors, edits, and selections live. Perfect for pair programming and collaborative debugging.',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Invite unlimited team members. Code review, brainstorm, and solve problems together in synchronized sessions.',
      color: 'purple',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built with WebSockets for instant updates. Experience smooth, lag-free coding with real-time sync.',
      color: 'green',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'End-to-end encrypted rooms. Your code stays confidential with password protection and secure connections.',
      color: 'orange',
    },
    {
      icon: Globe,
      title: 'Multi-language',
      description: 'Supports 50+ programming languages with syntax highlighting. From JavaScript to Python, we\'ve got you covered.',
      color: 'cyan',
    },
    {
      icon: Terminal,
      title: 'Built-in Terminal',
      description: 'Execute code directly in the editor. Run scripts, install packages, and see output without leaving the platform.',
      color: 'pink',
    },
  ];

  const useCases = [
    {
      emoji: '👨‍💻👩‍💻',
      title: 'Pair Programming',
      description: 'Two developers, one screen. Solve complex problems together with shared cursors and instant feedback.',
    },
    {
      emoji: '👥',
      title: 'Team Code Reviews',
      description: 'Review pull requests collaboratively. Comment, suggest changes, and fix issues in real-time sessions.',
    },
    {
      emoji: '🎓',
      title: 'Teaching & Learning',
      description: 'Perfect for coding bootcamps and tutorials. Explain concepts live with interactive coding examples.',
    },
    {
      emoji: '🚀',
      title: 'Hackathons',
      description: 'Build projects faster with your team. Real-time collaboration means no merge conflicts or waiting.',
    },
    {
      emoji: '🔧',
      title: 'Technical Interviews',
      description: 'Conduct coding interviews with shared editor. Watch candidates code and provide live feedback.',
    },
    {
      emoji: '🌐',
      title: 'Remote Teams',
      description: 'Bridge the distance gap. Collaborate seamlessly with distributed teams across different time zones.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.1),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(168,85,247,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.08),transparent_35%)]"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/70 dark:bg-gray-800/70 text-blue-700 dark:text-blue-300 text-sm font-medium shadow-sm animate-pulse">
              <Sparkles className="h-4 w-4 mr-2" />
              Real-time Collaborative Coding
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              Code Together in Real-Time
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-3xl mx-auto">
              V-Code is a powerful collaborative code editor that enables seamless real-time coding sessions. Write, edit, and debug code simultaneously with your entire team—no matter where they are in the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                icon={Play}
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/30"
              >
                Start Coding Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon={ArrowRight}
                onClick={() => navigate('/join')}
                className="border-blue-200 dark:border-gray-700 hover:border-blue-400"
              >
                Join a Room
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Live sync under 50ms
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-sm">
                <Lock className="h-4 w-4 text-blue-500" />
                End-to-end encrypted
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 dark:bg-gray-800/70 shadow-sm">
                <Cpu className="h-4 w-4 text-purple-500" />
                50+ languages
              </div>
            </div>
          </div>

          {/* Hero Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-gray-200/80 dark:border-gray-800/80 shadow-2xl mb-20 backdrop-blur-xl bg-white/80 dark:bg-gray-900/70">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse" />
            <div className="aspect-video bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex items-center justify-center relative">
              {/* Code Editor Preview */}
              <div className="absolute inset-0 p-8">
                <div className="h-full border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
                  {/* Editor Header */}
                  <div className="bg-gray-800/80 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 rounded-full bg-red-500 animate-pulse"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500 animate-pulse delay-75"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse delay-150"></div>
                    </div>
                    <div className="text-sm text-gray-300 font-medium flex items-center gap-2">
                      collaborative-session.js
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/40">Live</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs">A</div>
                        <div className="h-6 w-6 rounded-full bg-green-500 -ml-2 flex items-center justify-center text-xs">S</div>
                        <div className="h-6 w-6 rounded-full bg-purple-500 -ml-2 flex items-center justify-center text-xs">M</div>
                      </div>
                      <div className="text-xs text-gray-400">3 online</div>
                    </div>
                  </div>
                  
                  {/* Code Content */}
                  <div className="p-6 font-mono text-sm space-y-2">
                    <div className="text-green-400">// Real-time collaboration in action</div>
                    <div className="flex items-center gap-1">
                      <span className="text-blue-400">function</span>
                      <span className="text-yellow-400">collaborativeSum</span>
                      <span className="text-gray-300">(a, b) {`{`}</span>
                    </div>
                    <div className="text-gray-400 ml-4">// Multiple users editing simultaneously</div>
                    <div className="text-purple-400 ml-4 flex items-center gap-2">
                      <span>return</span>
                      <div className="ml-1 bg-blue-900/30 px-2 py-1 rounded border border-blue-700/30 animate-pulse">
                        a + b<span className="text-blue-300 animate-pulse">|</span>
                      </div>
                      <span className="text-xs text-green-400">← Alex is typing</span>
                    </div>
                    <div className="text-gray-300">{`}`}</div>
                    
                    <div className="mt-4 text-cyan-400">// Changes sync instantly across all connected devices</div>
                    <div className="text-gray-400 mt-1">// Perfect for pair programming, code reviews, and remote teams</div>
                    
                    <div className="mt-4">
                      <div className="text-pink-400">const <span className="text-gray-300">result = </span><span className="text-yellow-400">collaborativeSum</span><span className="text-gray-300">(5, 10);</span></div>
                      <div className="text-gray-400 ml-4">// Result: 15 (updates in real-time)</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay Text */}
              <div className="absolute bottom-8 left-8 right-8 bg-black/70 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-lg">
                <p className="text-white text-center text-sm flex items-center justify-center gap-2">
                  <span className="text-green-400 font-semibold">Live Preview:</span> Experience real-time collaborative editing with syntax highlighting, multiple cursors, and instant synchronization. See changes as they happen!
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">10K+</div>
              <p className="text-gray-600 dark:text-gray-400">Active Developers</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Growing daily</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">50K+</div>
              <p className="text-gray-600 dark:text-gray-400">Rooms Created</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Successful collaborations</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</div>
              <p className="text-gray-600 dark:text-gray-400">Uptime</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Reliable & stable</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">&lt;50ms</div>
              <p className="text-gray-600 dark:text-gray-400">Sync Speed</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Near-instant updates</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose V-Code?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} hoverable className="p-6">
                  <div className={`inline-flex p-3 rounded-xl bg-${feature.color}-100 dark:bg-${feature.color}-900/20 mb-4`}>
                    <feature.icon className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map((useCase, index) => (
                <Card key={index} hoverable className="p-6">
                  <div className="text-3xl mb-4">{useCase.emoji}</div>
                  <h3 className="text-xl font-semibold mb-3">{useCase.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{useCase.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Create a Room</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start a new coding session in seconds. Choose between public or private rooms.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Invite Your Team</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Share the room link with teammates. They can join instantly from any device.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">Code Together</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Collaborate in real-time. See each other's cursors, edits, and run code together.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Loved by Developers</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                    AS
                  </div>
                  <div>
                    <h4 className="font-semibold">Alex Smith</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Senior Developer @TechCorp</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "V-Code revolutionized our remote team's workflow. We conduct daily pair programming sessions that feel like we're in the same room."
                </p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    MP
                  </div>
                  <div>
                    <h4 className="font-semibold">Maria Patel</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Engineering Lead @StartupX</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "The real-time collaboration features are incredible. Our code review process is now 3x faster with instant feedback loops."
                </p>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    TJ
                  </div>
                  <div>
                    <h4 className="font-semibold">Tom Johnson</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-500">Bootcamp Instructor</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 italic">
                  "Teaching coding has never been easier. Students can see my edits in real-time and ask questions as we code together."
                </p>
              </Card>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center py-12 px-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border border-blue-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Join thousands of developers who are already coding together on V-Code. 
              No setup required, start collaborating in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                onClick={() => navigate('/create')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Play className="h-0 w-5 mr-2" />
                Start Free Session
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate('/auth?tab=signup')}
              >
                Create Free Account
              </Button>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">
              Free forever for small teams • No credit card required
            </p>
          </div>

          {/* Tech Stack */}
          <div className="mt-20 text-center">
            <p className="text-gray-500 dark:text-gray-500 text-sm mb-4">Powered by</p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-400 dark:text-gray-500">
              <div className="flex items-center">
                <Cpu className="h-5 w-5 mr-2" />
                <span>React</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                <span>WebSockets</span>
              </div>
              <div className="flex items-center">
                <Code className="h-5 w-5 mr-2" />
                <span>Monaco Editor</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                <span>Tailwind CSS</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <span>End-to-End Encryption</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;