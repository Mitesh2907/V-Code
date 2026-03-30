import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { Code, Menu, X, Home, Zap, BookOpen, Terminal, Rocket, LogIn, Sun, Moon } from 'lucide-react';
import Button from '../../common/Button/Button';
import { useTheme } from '../../../contexts/ThemeContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    // { label: 'Code Editor', href: '/editor', icon: Terminal },
    { label: 'Features', href: '/features', icon: Zap },
    { label: 'Documentation', href: '/documentation', icon: BookOpen },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`
  fixed top-0 left-0 w-full z-50
  transition-all duration-300
  ${isScrolled
        ? 'bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-gray-800'
        : 'bg-transparent'
      }
`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 md:h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/50">
                <Code className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                V-Code
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Collaborative Editor</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`
                    relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
                    flex items-center space-x-2 group
                    ${active
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="relative p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110 group"
              aria-label="Toggle theme"
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative w-5 h-5">
                <Sun
                  className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isDarkMode
                    ? 'rotate-90 scale-0 opacity-0'
                    : 'rotate-0 scale-100 opacity-100 text-yellow-500'
                    }`}
                />
                <Moon
                  className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${isDarkMode
                    ? 'rotate-0 scale-100 opacity-100 text-blue-400'
                    : '-rotate-90 scale-0 opacity-0'
                    }`}
                />
              </div>
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>

            {/* Rooms navigation */}
            <button
              onClick={() => navigate('/rooms')}
              className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Rooms
            </button>

            {/* Auth Buttons */}
            {!loading && !isAuthenticated ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
                icon={LogIn}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsAvatarOpen(prev => !prev)}
                  className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full 
  bg-gradient-to-br from-blue-500 to-purple-600 
  text-white text-sm font-semibold"
                >
                  {user?.fullName?.charAt(0).toUpperCase()}
                </button>


                {isAvatarOpen && (
                  <div className="absolute right-0 mt-2 w-48 
  bg-white dark:bg-gray-800 
  text-gray-800 dark:text-gray-200
  border border-gray-200 dark:border-gray-700 
  rounded-md shadow-xl 
  py-1 z-50">


                    <div className="px-4 py-2 text-sm 
  text-gray-800 dark:text-gray-200
  border-b border-gray-200 dark:border-gray-700">

                      {user?.fullName}
                    </div>

                    <button
                      onClick={() => {
                        setIsAvatarOpen(false);
                        navigate("/profile");
                      }}
                      className="w-full text-left px-4 py-2 text-sm 
  text-gray-700 dark:text-gray-300
  hover:bg-gray-100 dark:hover:bg-gray-700"

                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => {
                        setIsAvatarOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm 
  text-gray-700 dark:text-gray-300
  hover:bg-gray-100 dark:hover:bg-gray-700"

                    >
                      Sign Out
                    </button>

                  </div>
                )}

              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 py-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={`
                      px-4 py-3 text-base font-medium rounded-lg transition-all duration-200
                      flex items-center space-x-3
                      ${active
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600 dark:border-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                {/* Theme Toggle in Mobile Menu */}
                <button
                  onClick={() => {
                    toggleTheme();
                  }}
                  className="w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? (
                      <>
                        <Sun className="h-5 w-5 text-yellow-500" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 text-blue-400" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${isDarkMode ? 'bg-blue-500' : 'bg-yellow-400'
                    }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-5' : 'translate-x-0.5'
                      }`}></div>
                  </div>
                </button>

                <Link
                  to="/rooms"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  Rooms
                </Link>
                {!isAuthenticated ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/auth');
                    }}
                    fullWidth
                    icon={LogIn}
                  >
                    Sign In
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left px-4 py-3 rounded bg-gray-700 hover:bg-gray-600"
                    >
                      Sign Out
                    </button>
                    {user && (
                      <div className="px-4 py-2 flex items-center">
                        <img src={user?.avatar} alt={user?.fullName}
                          className="w-8 h-8 rounded-full mr-3" />
                        <div>
                          <div className="text-sm font-medium">{user?.fullName}</div>
                          <div className="text-xs text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;