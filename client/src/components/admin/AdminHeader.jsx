// src/components/admin/AdminHeader.jsx
import { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Menu,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminHeader = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="relative h-16 bg-[#0A0A0F] border-b border-gray-800/50 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white transition-colors lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-gray-400 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-800 border border-gray-700 rounded">
              ⌘ K
            </kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-800/50 rounded-lg text-gray-400 hover:text-white transition-colors relative"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-[#0A0A0F]" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-800">
                  <h3 className="text-sm font-semibold text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto scrollbar-thin">
                  {/* Notification items */}
                  <div className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <p className="text-sm text-white">New user registered</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="p-4 hover:bg-gray-800/50 transition-colors cursor-pointer">
                    <p className="text-sm text-white">Room #1234 was created</p>
                    <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 p-1 hover:bg-gray-800/50 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <User size={18} className="text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-500">admin@v-code.com</p>
            </div>
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-2">
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Profile
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                    Settings
                  </button>
                  <hr className="my-2 border-gray-800" />
                  <button className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;