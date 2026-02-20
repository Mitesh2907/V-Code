// src/pages/admin/AdminActivity.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Users,
  DoorOpen,
  MessageSquare,
  Video,
  FileText,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Eye,
  UserPlus,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Globe,
  Mail,
  Bell,
  Star,
  Zap,
  TrendingUp,
  MoreHorizontal,
  Play,
  Pause,
  StopCircle,
  Archive,
  Copy,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Ban,
  UserCheck,
  UserX,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Wifi,
  WifiOff,
  HardDrive,
  Cpu,
  Shield,
  ShieldOff,
  Key,
  KeyRound,
  CreditCard,
  DollarSign,
  BarChart3,
  PieChart,
  LineChart,
  Heart,
  HeartOff,
  Award,
  Medal,
  Trophy,
  Crown,
  Gem,
  Diamond,
  Sparkles,
  Flame,
  Droplet,
  Wind,
  Cloud,
  Sun,
  Moon,
  Compass,
  Map,
  MapPin,
  Navigation,
  Rocket,
  Orbit,
  Upload
} from 'lucide-react';
import SearchBar from '../../components/admin/SearchBar';
import FilterDropdown from '../../components/admin/FilterDropdown';
import Pagination from '../../components/admin/Pagination';
import StatusBadge from '../../components/admin/StatusBadge';
import { ActionButtons, ActionGroup } from '../../components/admin/ActionButtons';
import { formatDistanceToNow, format } from 'date-fns';

const AdminActivity = () => {
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('timeline'); // 'timeline', 'list', 'grid'
  const [timeRange, setTimeRange] = useState('today');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [activityStats, setActivityStats] = useState({});
  const [showDetails, setShowDetails] = useState(false);

  const itemsPerPage = 20;

  // Mock activity data generator
  const generateMockActivities = () => {
    const types = [
      { id: 'user_login', label: 'User Login', icon: LogIn, category: 'user' },
      { id: 'user_logout', label: 'User Logout', icon: LogOut, category: 'user' },
      { id: 'user_registered', label: 'New Registration', icon: UserPlus, category: 'user' },
      { id: 'user_blocked', label: 'User Blocked', icon: Ban, category: 'user' },
      { id: 'user_unblocked', label: 'User Unblocked', icon: UserCheck, category: 'user' },
      { id: 'room_created', label: 'Room Created', icon: DoorOpen, category: 'room' },
      { id: 'room_closed', label: 'Room Closed', icon: XCircle, category: 'room' },
      { id: 'room_deleted', label: 'Room Deleted', icon: Trash2, category: 'room' },
      { id: 'room_joined', label: 'Room Joined', icon: Users, category: 'room' },
      { id: 'room_left', label: 'Room Left', icon: Users, category: 'room' },
      { id: 'message_sent', label: 'Message Sent', icon: MessageSquare, category: 'message' },
      { id: 'message_deleted', label: 'Message Deleted', icon: Trash2, category: 'message' },
      { id: 'message_reported', label: 'Message Reported', icon: Flag, category: 'message' },
      { id: 'video_started', label: 'Video Call Started', icon: Video, category: 'video' },
      { id: 'video_ended', label: 'Video Call Ended', icon: Video, category: 'video' },
      { id: 'file_created', label: 'File Created', icon: FileText, category: 'file' },
      { id: 'file_deleted', label: 'File Deleted', icon: Trash2, category: 'file' },
      { id: 'file_modified', label: 'File Modified', icon: Edit, category: 'file' },
      { id: 'file_shared', label: 'File Shared', icon: Share2, category: 'file' },
      { id: 'system_backup', label: 'System Backup', icon: HardDrive, category: 'system' },
      { id: 'system_update', label: 'System Update', icon: RefreshCw, category: 'system' },
      { id: 'system_error', label: 'System Error', icon: AlertTriangle, category: 'system' },
      { id: 'system_warning', label: 'System Warning', icon: AlertTriangle, category: 'system' },
      { id: 'payment_success', label: 'Payment Successful', icon: CheckCircle, category: 'payment' },
      { id: 'payment_failed', label: 'Payment Failed', icon: XCircle, category: 'payment' },
      { id: 'subscription_started', label: 'Subscription Started', icon: Star, category: 'subscription' },
      { id: 'subscription_cancelled', label: 'Subscription Cancelled', icon: XCircle, category: 'subscription' },
      { id: 'permission_changed', label: 'Permissions Changed', icon: Shield, category: 'security' },
      { id: 'role_assigned', label: 'Role Assigned', icon: Crown, category: 'security' },
      { id: 'api_key_created', label: 'API Key Created', icon: Key, category: 'security' },
      { id: 'api_key_revoked', label: 'API Key Revoked', icon: KeyRound, category: 'security' },
      { id: 'export_completed', label: 'Export Completed', icon: Download, category: 'data' },
      { id: 'import_completed', label: 'Import Completed', icon: Upload, category: 'data' },
      { id: 'report_generated', label: 'Report Generated', icon: BarChart3, category: 'analytics' },
      { id: 'alert_triggered', label: 'Alert Triggered', icon: AlertTriangle, category: 'alert' },
      { id: 'alert_resolved', label: 'Alert Resolved', icon: CheckCircle, category: 'alert' },
    ];

    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com', avatar: 'JD', role: 'admin' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', avatar: 'JS', role: 'moderator' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', avatar: 'MJ', role: 'user' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', avatar: 'SW', role: 'user' },
      { id: 5, name: 'Alex Brown', email: 'alex@example.com', avatar: 'AB', role: 'user' },
      { id: 6, name: 'Emily Davis', email: 'emily@example.com', avatar: 'ED', role: 'user' },
      { id: 7, name: 'Chris Lee', email: 'chris@example.com', avatar: 'CL', role: 'moderator' },
      { id: 8, name: 'Lisa Wang', email: 'lisa@example.com', avatar: 'LW', role: 'admin' },
    ];

    const rooms = [
      { id: 'R001', name: 'React Workshop' },
      { id: 'R002', name: 'Team Meeting' },
      { id: 'R003', name: 'Code Review' },
      { id: 'R004', name: 'Pair Programming' },
      { id: 'R005', name: 'Architecture Discussion' },
      { id: 'R006', name: 'Frontend Guild' },
      { id: 'R007', name: 'Backend Planning' },
      { id: 'R008', name: 'DevOps Sync' },
    ];

    const generateActivity = (index) => {
      const typeObj = types[Math.floor(Math.random() * types.length)];
      const user = users[Math.floor(Math.random() * users.length)];
      const room = Math.random() > 0.3 ? rooms[Math.floor(Math.random() * rooms.length)] : null;
      const date = new Date();
      date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 10080)); // Random time in last 7 days

      let severity = 'info';
      if (typeObj.id.includes('error') || typeObj.id.includes('failed') || typeObj.id.includes('blocked')) {
        severity = 'error';
      } else if (typeObj.id.includes('warning') || typeObj.id.includes('alert')) {
        severity = 'warning';
      } else if (typeObj.id.includes('success') || typeObj.id.includes('completed')) {
        severity = 'success';
      }

      return {
        id: `ACT-${String(index + 1).padStart(6, '0')}`,
        type: typeObj.id,
        typeLabel: typeObj.label,
        category: typeObj.category,
        icon: typeObj.icon,
        user,
        room,
        timestamp: date,
        severity,
        metadata: {
          ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          userAgent: navigator.userAgent,
          location: ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin', 'Paris', 'Singapore'][Math.floor(Math.random() * 7)],
          duration: Math.floor(Math.random() * 3600),
          size: Math.floor(Math.random() * 1024 * 1024),
          status: Math.random() > 0.2 ? 'success' : 'failed',
          changes: Math.floor(Math.random() * 100),
          impact: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          details: `Additional information about this activity`,
        },
        read: Math.random() > 0.3,
        starred: Math.random() > 0.9,
      };
    };

    return Array.from({ length: 200 }, (_, i) => generateActivity(i));
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockData = generateMockActivities();
      setActivities(mockData);
      setFilteredActivities(mockData);
      calculateStats(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterActivities();
  }, [searchQuery, selectedFilters, timeRange, activities]);

  const filterActivities = () => {
    let filtered = [...activities];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (activity) =>
          activity.id.toLowerCase().includes(query) ||
          activity.user.name.toLowerCase().includes(query) ||
          activity.user.email.toLowerCase().includes(query) ||
          (activity.room?.name || '').toLowerCase().includes(query) ||
          activity.typeLabel.toLowerCase().includes(query)
      );
    }

    // Time range filter
    if (timeRange !== 'all') {
      const now = new Date();
      const ranges = {
        hour: 60 * 60 * 1000,
        today: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
      };
      const cutoff = new Date(now.getTime() - ranges[timeRange]);
      filtered = filtered.filter((activity) => new Date(activity.timestamp) > cutoff);
    }

    // Category filter
    if (selectedFilters.category?.length) {
      filtered = filtered.filter((activity) =>
        selectedFilters.category.includes(activity.category)
      );
    }

    // Severity filter
    if (selectedFilters.severity?.length) {
      filtered = filtered.filter((activity) =>
        selectedFilters.severity.includes(activity.severity)
      );
    }

    // User filter
    if (selectedFilters.user?.length) {
      filtered = filtered.filter((activity) =>
        selectedFilters.user.includes(activity.user.id.toString())
      );
    }

    setFilteredActivities(filtered);
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      bySeverity: {},
      byCategory: {},
      byUser: {},
      timeline: {},
      readCount: data.filter(a => a.read).length,
      unreadCount: data.filter(a => !a.read).length,
      starredCount: data.filter(a => a.starred).length,
      uniqueUsers: new Set(data.map(a => a.user.id)).size,
    };

    data.forEach(activity => {
      // Severity counts
      stats.bySeverity[activity.severity] = (stats.bySeverity[activity.severity] || 0) + 1;

      // Category counts
      stats.byCategory[activity.category] = (stats.byCategory[activity.category] || 0) + 1;

      // User counts
      stats.byUser[activity.user.id] = (stats.byUser[activity.user.id] || 0) + 1;

      // Timeline (by hour)
      const hour = format(new Date(activity.timestamp), 'HH:00');
      stats.timeline[hour] = (stats.timeline[hour] || 0) + 1;
    });

    setActivityStats(stats);
  };

  const handleMarkAsRead = (activityId) => {
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId ? { ...a, read: true } : a
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setActivities(prev =>
      prev.map(a => ({ ...a, read: true }))
    );
  };

  const handleToggleStar = (activityId) => {
    setActivities(prev =>
      prev.map(a =>
        a.id === activityId ? { ...a, starred: !a.starred } : a
      )
    );
  };

  const handleDeleteActivity = (activityId) => {
    setActivities(prev => prev.filter(a => a.id !== activityId));
  };

  const handleExport = () => {
    const dataToExport = selectedActivities.length > 0 
      ? filteredActivities.filter(a => selectedActivities.includes(a.id))
      : filteredActivities;
    
    console.log('Exporting:', dataToExport);
    // Implement actual export logic
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newData = generateMockActivities();
      setActivities(newData);
      calculateStats(newData);
      setIsLoading(false);
    }, 1000);
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'text-blue-400 bg-blue-500/20',
      success: 'text-emerald-400 bg-emerald-500/20',
      warning: 'text-amber-400 bg-amber-500/20',
      error: 'text-rose-400 bg-rose-500/20',
    };
    return colors[severity] || colors.info;
  };

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter configurations
  const filterConfig = [
    {
      id: 'category',
      label: 'Category',
      icon: Activity,
      options: [
        { id: 'user', label: 'User Actions', icon: Users },
        { id: 'room', label: 'Room Actions', icon: DoorOpen },
        { id: 'message', label: 'Messages', icon: MessageSquare },
        { id: 'video', label: 'Video Calls', icon: Video },
        { id: 'file', label: 'Files', icon: FileText },
        { id: 'system', label: 'System', icon: Settings },
        { id: 'payment', label: 'Payments', icon: DollarSign },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'alert', label: 'Alerts', icon: AlertTriangle },
      ],
    },
    {
      id: 'severity',
      label: 'Severity',
      icon: AlertTriangle,
      options: [
        { id: 'info', label: 'Info', color: '#3B82F6' },
        { id: 'success', label: 'Success', color: '#10B981' },
        { id: 'warning', label: 'Warning', color: '#F59E0B' },
        { id: 'error', label: 'Error', color: '#EF4444' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Activity Log</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor all platform activities in real-time
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <CheckCircle size={16} />
            Mark all as read
          </button>
          
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg transition-colors"
          >
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Activities</p>
              <h3 className="text-2xl font-bold text-white mt-1">{activityStats.total}</h3>
            </div>
            <div className="p-3 bg-indigo-500/20 rounded-lg">
              <Activity className="text-indigo-400" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <h3 className="text-2xl font-bold text-white mt-1">{activityStats.unreadCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Bell className="text-amber-400" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Starred</p>
              <h3 className="text-2xl font-bold text-white mt-1">{activityStats.starredCount}</h3>
            </div>
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <Star className="text-amber-400" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Users</p>
              <h3 className="text-2xl font-bold text-white mt-1">{activityStats.uniqueUsers}</h3>
            </div>
            <div className="p-3 bg-emerald-500/20 rounded-lg">
              <Users className="text-emerald-400" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Errors</p>
              <h3 className="text-2xl font-bold text-white mt-1">{activityStats.bySeverity?.error || 0}</h3>
            </div>
            <div className="p-3 bg-rose-500/20 rounded-lg">
              <AlertTriangle className="text-rose-400" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            placeholder="Search activities by ID, user, room, or type..."
            value={searchQuery}
            onChange={setSearchQuery}
            showRecent
            recentSearches={['user login', 'room created', 'error']}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <FilterDropdown
            label="Filters"
            icon={Filter}
            filters={filterConfig}
            selectedFilters={selectedFilters}
            onFilterChange={setSelectedFilters}
            variant="outline"
          />
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="hour">Last Hour</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          
          <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'timeline' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Activity size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <DoorOpen size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      {viewMode === 'timeline' && (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-800" />
          
          <div className="space-y-4">
            {paginatedActivities.map((activity, index) => {
              const Icon = activity.icon;
              
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-start gap-4 group"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center ${
                    activity.severity === 'error' ? 'bg-rose-500/20' :
                    activity.severity === 'warning' ? 'bg-amber-500/20' :
                    activity.severity === 'success' ? 'bg-emerald-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    <Icon className={
                      activity.severity === 'error' ? 'text-rose-400' :
                      activity.severity === 'warning' ? 'text-amber-400' :
                      activity.severity === 'success' ? 'text-emerald-400' :
                      'text-blue-400'
                    } size={24} />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-4 group-hover:border-gray-700/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-medium">{activity.typeLabel}</h3>
                          <StatusBadge status={activity.severity} />
                          {!activity.read && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">New</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          by {activity.user.name} • {activity.user.email}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </span>
                        
                        <ActionGroup
                          actions={[
                            {
                              icon: activity.starred ? Star : Star,
                              onClick: () => handleToggleStar(activity.id),
                              tooltip: activity.starred ? 'Remove star' : 'Add star',
                              variant: activity.starred ? 'warning' : 'ghost',
                            },
                            {
                              icon: CheckCircle,
                              onClick: () => handleMarkAsRead(activity.id),
                              tooltip: 'Mark as read',
                              disabled: activity.read,
                            },
                            {
                              icon: Eye,
                              onClick: () => {
                                setSelectedActivity(activity);
                                setShowDetails(true);
                              },
                              tooltip: 'View details',
                            },
                            {
                              icon: Trash2,
                              onClick: () => handleDeleteActivity(activity.id),
                              tooltip: 'Delete',
                              variant: 'danger',
                            },
                          ]}
                        />
                      </div>
                    </div>
                    
                    {activity.room && (
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <DoorOpen size={14} className="text-gray-600" />
                        <span className="text-gray-400">Room:</span>
                        <span className="text-white">{activity.room.name}</span>
                        <span className="text-gray-600">({activity.room.id})</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        {activity.metadata.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Wifi size={12} />
                        {activity.metadata.ip}
                      </span>
                      {activity.metadata.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {Math.floor(activity.metadata.duration / 60)}m
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="w-8 p-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActivities(paginatedActivities.map(a => a.id));
                        } else {
                          setSelectedActivities([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Activity</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Room</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Time</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {paginatedActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    
                    return (
                      <motion.tr
                        key={activity.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors ${
                          !activity.read ? 'bg-indigo-500/5' : ''
                        }`}
                      >
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedActivities.includes(activity.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedActivities([...selectedActivities, activity.id]);
                              } else {
                                setSelectedActivities(selectedActivities.filter(id => id !== activity.id));
                              }
                            }}
                            className="rounded border-gray-700 bg-gray-900 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                              <Icon size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{activity.typeLabel}</p>
                              <p className="text-xs text-gray-500">{activity.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                              {activity.user.avatar}
                            </div>
                            <div>
                              <p className="text-sm text-white">{activity.user.name}</p>
                              <p className="text-xs text-gray-500">{activity.user.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {activity.room ? (
                            <div>
                              <p className="text-sm text-white">{activity.room.name}</p>
                              <p className="text-xs text-gray-500">{activity.room.id}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-600">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="text-sm text-white">
                              {format(new Date(activity.timestamp), 'MMM d, HH:mm')}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <StatusBadge status={activity.severity} />
                        </td>
                        <td className="p-4">
                          <ActionGroup
                            actions={[
                              {
                                icon: activity.starred ? Star : Star,
                                onClick: () => handleToggleStar(activity.id),
                                tooltip: activity.starred ? 'Remove star' : 'Add star',
                              },
                              {
                                icon: Eye,
                                onClick: () => {
                                  setSelectedActivity(activity);
                                  setShowDetails(true);
                                },
                                tooltip: 'View details',
                              },
                              {
                                icon: Trash2,
                                onClick: () => handleDeleteActivity(activity.id),
                                tooltip: 'Delete',
                                variant: 'danger',
                              },
                            ]}
                          />
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedActivities.map((activity, index) => {
            const Icon = activity.icon;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl p-4 hover:border-gray-700/50 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${getSeverityColor(activity.severity)}`}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <ActionButtons.More
  onClick={() => handleToggleStar(activity.id)}
  size="sm"
/>

                    <ActionButtons.More size="sm" />
                  </div>
                </div>
                
                <h3 className="text-white font-medium mb-1">{activity.typeLabel}</h3>
                <p className="text-sm text-gray-500 mb-3">{activity.id}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                    {activity.user.avatar}
                  </div>
                  <span className="text-sm text-white">{activity.user.name}</span>
                  <StatusBadge status={activity.severity} />
                </div>
                
                {activity.room && (
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <DoorOpen size={14} />
                    <span>{activity.room.name}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-800">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                  
                  <button
                    onClick={() => {
                      setSelectedActivity(activity);
                      setShowDetails(true);
                    }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredActivities.length / itemsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Activity Details Modal */}
      <AnimatePresence>
        {showDetails && selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-thin"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl ${getSeverityColor(selectedActivity.severity)}`}>
                      {selectedActivity.icon && <selectedActivity.icon size={32} />}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedActivity.typeLabel}</h2>
                      <p className="text-sm text-gray-500 mt-1">ID: {selectedActivity.id}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowDetails(false)}
                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* User Info */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">User Information</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-lg font-semibold">
                        {selectedActivity.user.avatar}
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedActivity.user.name}</p>
                        <p className="text-sm text-gray-500">{selectedActivity.user.email}</p>
                        <p className="text-xs text-gray-600 mt-1">Role: {selectedActivity.user.role}</p>
                      </div>
                    </div>
                  </div>

                  {/* Room Info */}
                  {selectedActivity.room && (
                    <div className="bg-gray-800/50 rounded-xl p-4">
                      <h3 className="text-sm font-medium text-gray-400 mb-3">Room Information</h3>
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-500/20 rounded-lg">
                          <DoorOpen className="text-indigo-400" size={24} />
                        </div>
                        <div>
                          <p className="text-white font-medium">{selectedActivity.room.name}</p>
                          <p className="text-sm text-gray-500">ID: {selectedActivity.room.id}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity Details */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Activity Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Timestamp</p>
                        <p className="text-sm text-white mt-1">
                          {format(new Date(selectedActivity.timestamp), 'PPP p')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Severity</p>
                        <div className="mt-1">
                          <StatusBadge status={selectedActivity.severity} />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm text-white mt-1">{selectedActivity.metadata.location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">IP Address</p>
                        <p className="text-sm text-white mt-1">{selectedActivity.metadata.ip}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-sm text-white mt-1 capitalize">{selectedActivity.metadata.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Impact</p>
                        <p className="text-sm text-white mt-1 capitalize">{selectedActivity.metadata.impact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="bg-gray-800/50 rounded-xl p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Additional Metadata</h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-300">{selectedActivity.metadata.details}</p>
                      <p className="text-xs text-gray-600 mt-2">{selectedActivity.metadata.userAgent}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                    <button
                      onClick={() => handleMarkAsRead(selectedActivity.id)}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as Read
                    </button>
                    <button
                      onClick={() => {
                        handleToggleStar(selectedActivity.id);
                      }}
                      className={`px-4 py-2 ${
                        selectedActivity.starred
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-gray-800 hover:bg-gray-700'
                      } text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
                    >
                      <Star size={16} />
                      {selectedActivity.starred ? 'Starred' : 'Add Star'}
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteActivity(selectedActivity.id);
                        setShowDetails(false);
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminActivity;