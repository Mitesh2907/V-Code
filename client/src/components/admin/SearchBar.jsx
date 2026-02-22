// src/components/admin/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Filter, 
  History, 
  TrendingUp,
  Clock,
  Users,
  DoorOpen,
  FileText,
  MessageSquare,
  Zap,
  Command,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Loader2,
  Mic,
  MicOff,
  Sparkles
} from 'lucide-react';

const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  filters = [],
  selectedFilter,
  onFilterChange,
  isLoading = false,
  voiceSearch = false,
  onVoiceSearch,
  shortcuts = true,
  size = 'md',
  variant = 'default',
  className = '',
  autoFocus = false,
  debounceMs = 300,
  maxSuggestions = 5,
  showRecent = true,
  showPopular = true,
  showFilters = true,
  showShortcuts = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isListening, setIsListening] = useState(false);
  const [recentList, setRecentList] = useState(recentSearches);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search input
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (onChange) {
        onChange(inputValue);
      }
      if (inputValue.trim() && onSearch) {
        onSearch(inputValue);
      }
    }, debounceMs);

    return () => clearTimeout(debounceTimer.current);
  }, [inputValue, debounceMs, onChange, onSearch]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    const totalItems = getFilteredSuggestions().length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < totalItems - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const selected = getFilteredSuggestions()[selectedIndex];
          handleSuggestionClick(selected);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      case 'k':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          inputRef.current?.focus();
        }
        break;
      default:
        break;
    }
  };

  const handleSearch = () => {
    if (inputValue.trim()) {
      // Add to recent searches
      if (!recentList.includes(inputValue)) {
        setRecentList(prev => [inputValue, ...prev].slice(0, 5));
      }
      
      if (onSearch) {
        onSearch(inputValue);
      }
      setIsOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    if (onSearch) {
      onSearch(suggestion);
    }
    
    // Add to recent searches
    if (!recentList.includes(suggestion)) {
      setRecentList(prev => [suggestion, ...prev].slice(0, 5));
    }
    
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInputValue('');
    setSelectedIndex(-1);
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    if (!voiceSearch) return;

    if (!isListening) {
      setIsListening(true);
      if (onVoiceSearch) {
        onVoiceSearch();
      }

      // Simulate voice recognition (replace with actual Web Speech API)
      setTimeout(() => {
        setIsListening(false);
        setInputValue('voice search result');
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const getFilteredSuggestions = () => {
    if (!inputValue.trim()) {
      return [];
    }
    
    return suggestions
      .filter(s => s.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, maxSuggestions);
  };

  const sizes = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-base',
    lg: 'h-14 text-lg',
  };

  const variants = {
    default: 'bg-gray-900/50 border-gray-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50',
    glass: 'bg-gray-900/30 backdrop-blur-xl border-gray-800/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50',
    outline: 'bg-transparent border-gray-800 hover:border-gray-700 focus:border-indigo-500/50',
    minimal: 'bg-transparent border-transparent hover:border-gray-800 focus:border-indigo-500/50',
  };

  const suggestionIcons = {
    user: Users,
    room: DoorOpen,
    file: FileText,
    message: MessageSquare,
    default: Search,
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input Container */}
      <div className={`relative flex items-center ${sizes[size]}`}>
        {/* Search Icon */}
        <Search 
          size={size === 'sm' ? 16 : size === 'md' ? 18 : 20}
          className="absolute left-3 text-gray-500"
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full pl-10 pr-24 ${sizes[size]} bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 transition-all ${variants[variant]}`}
        />

        {/* Right Side Actions */}
        <div className="absolute right-3 flex items-center gap-2">
          {/* Voice Search */}
          {voiceSearch && (
            <button
              onClick={handleVoiceSearch}
              className={`p-1 rounded-lg transition-colors ${
                isListening 
                  ? 'text-red-400 animate-pulse' 
                  : 'text-gray-500 hover:text-white hover:bg-gray-800'
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}

          {/* Clear Button */}
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 text-gray-500 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X size={size === 'sm' ? 14 : 16} />
            </button>
          )}

          {/* Loading Spinner */}
          {isLoading && (
            <Loader2 size={16} className="text-indigo-500 animate-spin" />
          )}

          {/* Keyboard Shortcut */}
          {shortcuts && !inputValue && !isLoading && (
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-800 border border-gray-700 rounded">
              <Command size={12} />
              <span>K</span>
            </kbd>
          )}
        </div>

        {/* Filter Button (if filters exist) */}
        {filters.length > 0 && showFilters && (
          <div className="absolute right-14 flex items-center">
            <div className="w-px h-5 bg-gray-800 mx-2" />
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Filter size={14} />
              {selectedFilter && <span className="text-indigo-400">{selectedFilter.label}</span>}
            </button>
          </div>
        )}
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 mt-2 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Filter Tabs */}
            {filters.length > 0 && showFilters && (
              <div className="flex items-center gap-1 p-2 border-b border-gray-800 overflow-x-auto scrollbar-thin">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => onFilterChange?.(filter)}
                    className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors ${
                      selectedFilter?.id === filter.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {filter.icon && <filter.icon size={12} className="inline mr-1" />}
                    {filter.label}
                  </button>
                ))}
              </div>
            )}

            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              {/* Suggestions */}
              {getFilteredSuggestions().length > 0 && (
                <div className="p-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <Sparkles size={14} className="text-indigo-400" />
                    <span className="text-xs font-medium text-gray-400">Suggestions</span>
                  </div>
                  {getFilteredSuggestions().map((suggestion, index) => {
                    const Icon = suggestionIcons[suggestion.type] || suggestionIcons.default;
                    
                    return (
                      <motion.button
                        key={suggestion}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                          index === selectedIndex
                            ? 'bg-indigo-600/20 text-indigo-400'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        <Icon size={14} />
                        <span className="flex-1 text-left">{suggestion}</span>
                        <ChevronRight size={14} className="text-gray-600" />
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Recent Searches */}
              {showRecent && recentList.length > 0 && (
                <div className="p-2 border-t border-gray-800">
                  <div className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <History size={14} className="text-gray-500" />
                      <span className="text-xs font-medium text-gray-400">Recent</span>
                    </div>
                    <button 
                      onClick={() => setRecentList([])}
                      className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  {recentList.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(search)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Clock size={14} />
                      <span className="flex-1 text-left">{search}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular Searches */}
              {showPopular && popularSearches.length > 0 && (
                <div className="p-2 border-t border-gray-800">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <TrendingUp size={14} className="text-gray-500" />
                    <span className="text-xs font-medium text-gray-400">Popular</span>
                  </div>
                  <div className="flex flex-wrap gap-2 px-3">
                    {popularSearches.map((search) => (
                      <button
                        key={search}
                        onClick={() => handleSuggestionClick(search)}
                        className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Tips */}
              {showShortcuts && (
                <div className="p-3 border-t border-gray-800 bg-gray-900/50">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs">↑</kbd>
                      <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs">↓</kbd>
                      <span>to navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs">↵</kbd>
                      <span>to select</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-gray-800 border border-gray-700 rounded text-xs">esc</kbd>
                      <span>to close</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search Action */}
            {inputValue && (
              <div className="p-2 border-t border-gray-800">
                <button
                  onClick={handleSearch}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  <Search size={16} />
                  Search for "{inputValue}"
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Preset Search Configurations
export const UserSearchBar = (props) => {
  const userSuggestions = [
    'john.doe@example.com',
    'jane.smith@example.com',
    'mike.johnson@example.com',
    'sarah.wilson@example.com',
    'alex.brown@example.com',
  ];

  const popularSearches = [
    'active users',
    'admins',
    'recent signups',
    'inactive users',
  ];

  const filters = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'active', label: 'Active', icon: Zap },
    { id: 'inactive', label: 'Inactive', icon: Clock },
    { id: 'blocked', label: 'Blocked', icon: X },
  ];

  return (
    <SearchBar
      placeholder="Search users by name, email, or ID..."
      suggestions={userSuggestions}
      popularSearches={popularSearches}
      filters={filters}
      voiceSearch
      {...props}
    />
  );
};

export const RoomSearchBar = (props) => {
  const roomSuggestions = [
    'React Workshop',
    'Team Meeting',
    'Code Review',
    'Pair Programming',
    'Architecture Discussion',
  ];

  const popularSearches = [
    'active rooms',
    'popular rooms',
    'recent rooms',
    'locked rooms',
  ];

  const filters = [
    { id: 'all', label: 'All', icon: DoorOpen },
    { id: 'active', label: 'Active', icon: Zap },
    { id: 'closed', label: 'Closed', icon: X },
    { id: 'locked', label: 'Locked', icon: Lock },
  ];

  return (
    <SearchBar
      placeholder="Search rooms by name, ID, or creator..."
      suggestions={roomSuggestions}
      popularSearches={popularSearches}
      filters={filters}
      voiceSearch
      {...props}
    />
  );
};

export const GlobalSearchBar = (props) => {
  const suggestions = [
    { text: 'john.doe@example.com', type: 'user', icon: Users },
    { text: 'React Workshop', type: 'room', icon: DoorOpen },
    { text: 'styles.css', type: 'file', icon: FileText },
    { text: 'Welcome message', type: 'message', icon: MessageSquare },
  ];

  const recentSearches = [
    'active users',
    'React Workshop',
    'code review',
    'pair programming',
  ];

  const popularSearches = [
    'getting started',
    'tutorial',
    'help',
    'features',
  ];

  const filters = [
    { id: 'all', label: 'All', icon: Search },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'rooms', label: 'Rooms', icon: DoorOpen },
    { id: 'files', label: 'Files', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <SearchBar
      placeholder="Search anywhere..."
      suggestions={suggestions.map(s => s.text)}
      recentSearches={recentSearches}
      popularSearches={popularSearches}
      filters={filters}
      voiceSearch
      shortcuts
      size="lg"
      variant="glass"
      {...props}
    />
  );
};

// Search Results Component
export const SearchResults = ({ results, isLoading, onSelect, onClose }) => {
  const resultGroups = {
    users: results?.filter(r => r.type === 'user') || [],
    rooms: results?.filter(r => r.type === 'room') || [],
    files: results?.filter(r => r.type === 'file') || [],
    messages: results?.filter(r => r.type === 'message') || [],
  };

  const icons = {
    users: Users,
    rooms: DoorOpen,
    files: FileText,
    messages: MessageSquare,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 size={32} className="text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!results || results.length === 0) {
    return (
      <div className="text-center py-12">
        <Search size={48} className="mx-auto text-gray-600 mb-4" />
        <p className="text-gray-400">No results found</p>
        <p className="text-sm text-gray-600 mt-1">Try different keywords</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(resultGroups).map(([key, items]) => {
        if (items.length === 0) return null;
        const Icon = icons[key];

        return (
          <div key={key}>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50">
              <Icon size={14} className="text-gray-500" />
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                {key} ({items.length})
              </h3>
            </div>
            <div className="p-2">
              {items.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelect(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg transition-colors group"
                >
                  <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                    <Icon size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-white">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-600" />
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SearchBar;