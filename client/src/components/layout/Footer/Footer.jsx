import React from 'react';
import { Code, Github, Twitter, Linkedin, Heart, Mail, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Product',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'API', href: '#api' },
        { label: 'Documentation', href: '#docs' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Careers', href: '#careers' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Community', href: '#community' },
        { label: 'Support', href: '#support' },
        { label: 'Status', href: '#status' },
        { label: 'Security', href: '#security' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', href: '#privacy' },
        { label: 'Terms', href: '#terms' },
        { label: 'Cookies', href: '#cookies' },
        { label: 'Licenses', href: '#licenses' },
      ],
    },
  ];

  const socialLinks = [
    { icon: Github, label: 'GitHub', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
    { icon: Mail, label: 'Email', href: '#' },
  ];

  return (
    <footer className="mt-auto border-t border-gray-200/50 dark:border-gray-800/50 bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                V-Code
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-sm leading-relaxed">
              The collaborative code editor built for modern development teams. 
              Real-time editing, seamless integration, and enterprise-grade security.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 hover:scale-105 hover:shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 text-sm uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center group"
                      >
                        <span className="h-0.5 w-0 bg-blue-500 rounded-full group-hover:w-3 mr-2 transition-all duration-200"></span>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200/50 dark:border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
              <Globe className="h-4 w-4" />
              <span>English • India</span>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
              © {currentYear} V-Code. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Cookies
              </a>
            </div>
          </div>
          
          {/* Made with love */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-500 text-sm flex items-center justify-center">
              Made with <Heart className="h-3 w-3 mx-1 text-red-500 fill-current animate-pulse" /> 
              by developers, for developers
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
              Version 2.0 • Built with React, TypeScript, and WebSockets
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;