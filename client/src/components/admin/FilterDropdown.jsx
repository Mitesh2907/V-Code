// src/components/admin/FilterDropdown.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  ChevronDown, 
  Check, 
  X, 
  SlidersHorizontal,
  Calendar,
  SortAsc,
  SortDesc,
  Users,
  DoorOpen,
  Clock,
  Activity,
  Star,
  TrendingUp,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const FilterDropdown = ({
  label = 'Filter',
  icon: Icon = Filter,
  filters = [],
  selectedFilters = {},
  onFilterChange,
  onClear,
  variant = 'default',
  size = 'md',
  position = 'bottom-right',
  showSearch = false,
  multiSelect = true,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const variants = {
    default: 'bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    outline: 'bg-transparent border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-gray-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const positions = {
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'top-right': 'bottom-full right-0 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
  };

  const getSelectedCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  const handleFilterSelect = (filterId, optionId) => {
    const currentSelected = selectedFilters[filterId] || [];
    let newSelected;

    if (multiSelect) {
      if (currentSelected.includes(optionId)) {
        newSelected = currentSelected.filter(id => id !== optionId);
      } else {
        newSelected = [...currentSelected, optionId];
      }
    } else {
      newSelected = [optionId];
    }

    onFilterChange({
      ...selectedFilters,
      [filterId]: newSelected
    });
  };

  const handleClearFilter = (filterId) => {
    const newFilters = { ...selectedFilters };
    delete newFilters[filterId];
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    onFilterChange({});
    if (onClear) onClear();
    setIsOpen(false);
  };

  const filteredFilters = filters.map(filter => ({
    ...filter,
    options: filter.options?.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(filter => filter.options?.length > 0);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Filter Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-lg transition-all duration-200 ${
          variants[variant]
        } ${sizes[size]}`}
      >
        <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
        <span>{label}</span>
        {getSelectedCount() > 0 && (
          <span className="flex items-center justify-center w-5 h-5 text-xs font-medium bg-indigo-600 text-white rounded-full">
            {getSelectedCount()}
          </span>
        )}
        <ChevronDown 
          size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 min-w-[280px] max-w-[320px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden ${positions[position]}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-white">Filter Options</h3>
              <button
                onClick={handleClearAll}
                className="text-xs text-gray-500 hover:text-white transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Search */}
            {showSearch && (
              <div className="p-3 border-b border-gray-800">
                <div className="relative">
                  <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search filters..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>
            )}

            {/* Filter Groups */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
              {filteredFilters.map((filter) => (
                <div key={filter.id} className="border-b border-gray-800 last:border-0">
                  <div className="px-4 py-2 bg-gray-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {filter.icon && <filter.icon size={14} className="text-gray-500" />}
                        <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                          {filter.label}
                        </span>
                      </div>
                      {selectedFilters[filter.id]?.length > 0 && (
                        <button
                          onClick={() => handleClearFilter(filter.id)}
                          className="text-gray-500 hover:text-white transition-colors"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-2">
                    {filter.options.map((option) => {
                      const isSelected = selectedFilters[filter.id]?.includes(option.id);

                      return (
                        <motion.button
                          key={option.id}
                          whileHover={{ x: 4 }}
                          onClick={() => handleFilterSelect(filter.id, option.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            isSelected 
                              ? 'bg-indigo-600/20 text-indigo-400' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {option.color && (
                              <span 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: option.color }}
                              />
                            )}
                            {option.icon && <option.icon size={14} />}
                            <span>{option.label}</span>
                          </div>
                          {isSelected && <Check size={14} className="text-indigo-400" />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {filteredFilters.length === 0 && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500">No filters found</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-800 bg-gray-900/50">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Preset filter configurations for common use cases
export const UserFilters = ({ selectedFilters, onFilterChange }) => {
  const filters = [
    {
      id: 'status',
      label: 'Status',
      icon: Activity,
      options: [
        { id: 'active', label: 'Active', color: '#10B981' },
        { id: 'inactive', label: 'Inactive', color: '#6B7280' },
        { id: 'blocked', label: 'Blocked', color: '#EF4444' },
        { id: 'pending', label: 'Pending', color: '#F59E0B' },
      ]
    },
    {
      id: 'role',
      label: 'Role',
      icon: Users,
      options: [
        { id: 'admin', label: 'Admin', icon: Star },
        { id: 'moderator', label: 'Moderator', icon: Shield },
        { id: 'user', label: 'User', icon: Users },
        { id: 'guest', label: 'Guest', icon: Eye },
      ]
    },
    {
      id: 'activity',
      label: 'Last Active',
      icon: Clock,
      options: [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'inactive', label: '30+ days', icon: EyeOff },
      ]
    },
  ];

  return (
    <FilterDropdown
      label="User Filters"
      icon={Users}
      filters={filters}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      showSearch
      variant="outline"
    />
  );
};

export const RoomFilters = ({ selectedFilters, onFilterChange }) => {
  const filters = [
    {
      id: 'status',
      label: 'Status',
      icon: Activity,
      options: [
        { id: 'active', label: 'Active', color: '#10B981' },
        { id: 'closed', label: 'Closed', color: '#6B7280' },
        { id: 'archived', label: 'Archived', color: '#8B5CF6' },
        { id: 'locked', label: 'Locked', color: '#EF4444' },
      ]
    },
    {
      id: 'type',
      label: 'Room Type',
      icon: DoorOpen,
      options: [
        { id: 'workshop', label: 'Workshop', icon: Activity },
        { id: 'meeting', label: 'Meeting', icon: Users },
        { id: 'pair', label: 'Pair Programming', icon: Users },
        { id: 'review', label: 'Code Review', icon: Eye },
        { id: 'discussion', label: 'Discussion', icon: Globe },
      ]
    },
    {
      id: 'visibility',
      label: 'Visibility',
      icon: Eye,
      options: [
        { id: 'public', label: 'Public', icon: Globe },
        { id: 'private', label: 'Private', icon: Lock },
        { id: 'unlisted', label: 'Unlisted', icon: EyeOff },
      ]
    },
    {
      id: 'created',
      label: 'Created',
      icon: Calendar,
      options: [
        { id: 'today', label: 'Today' },
        { id: 'week', label: 'This Week' },
        { id: 'month', label: 'This Month' },
        { id: 'older', label: 'Older' },
      ]
    },
  ];

  return (
    <FilterDropdown
      label="Room Filters"
      icon={DoorOpen}
      filters={filters}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      showSearch
      variant="outline"
    />
  );
};

export const DateFilters = ({ selectedFilters, onFilterChange }) => {
  const filters = [
    {
      id: 'dateRange',
      label: 'Date Range',
      icon: Calendar,
      options: [
        { id: 'today', label: 'Today' },
        { id: 'yesterday', label: 'Yesterday' },
        { id: 'last7', label: 'Last 7 days' },
        { id: 'last30', label: 'Last 30 days' },
        { id: 'last90', label: 'Last 90 days' },
        { id: 'custom', label: 'Custom Range' },
      ]
    },
    {
      id: 'sortBy',
      label: 'Sort By',
      icon: SortAsc,
      options: [
        { id: 'newest', label: 'Newest first', icon: SortDesc },
        { id: 'oldest', label: 'Oldest first', icon: SortAsc },
        { id: 'popular', label: 'Most popular', icon: TrendingUp },
        { id: 'active', label: 'Most active', icon: Activity },
      ]
    },
  ];

  return (
    <FilterDropdown
      label="Date Filters"
      icon={Calendar}
      filters={filters}
      selectedFilters={selectedFilters}
      onFilterChange={onFilterChange}
      variant="outline"
    />
  );
};

// Advanced Filter with Range Sliders
export const AdvancedFilters = ({ selectedFilters, onFilterChange, onClose }) => {
  const [localFilters, setLocalFilters] = useState(selectedFilters);

  const filters = [
    {
      id: 'userCount',
      label: 'User Count',
      type: 'range',
      min: 0,
      max: 100,
      step: 1,
      icon: Users,
    },
    {
      id: 'messageCount',
      label: 'Messages',
      type: 'range',
      min: 0,
      max: 1000,
      step: 10,
      icon: Activity,
    },
    {
      id: 'storage',
      label: 'Storage Used',
      type: 'range',
      min: 0,
      max: 1024,
      step: 10,
      unit: 'MB',
      icon: SlidersHorizontal,
    },
  ];

  const handleApply = () => {
    onFilterChange(localFilters);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden w-80"
    >
      <div className="px-4 py-3 border-b border-gray-800">
        <h3 className="text-sm font-semibold text-white">Advanced Filters</h3>
      </div>

      <div className="p-4 space-y-4">
        {filters.map((filter) => (
          <div key={filter.id}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <filter.icon size={14} className="text-gray-500" />
                <span className="text-xs text-gray-400">{filter.label}</span>
              </div>
              <span className="text-xs text-white">
                {localFilters[filter.id] || filter.min} {filter.unit}
              </span>
            </div>
            <input
              type="range"
              min={filter.min}
              max={filter.max}
              step={filter.step}
              value={localFilters[filter.id] || filter.min}
              onChange={(e) => setLocalFilters({
                ...localFilters,
                [filter.id]: parseInt(e.target.value)
              })}
              className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-800">
        <button
          onClick={onClose}
          className="px-3 py-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </motion.div>
  );
};

// Active Filter Tags
export const ActiveFilterTags = ({ filters, selectedFilters, onRemoveFilter, onClearAll }) => {
  const getFilterLabel = (filterId, optionId) => {
    const filter = filters.find(f => f.id === filterId);
    if (!filter) return optionId;
    const option = filter.options?.find(o => o.id === optionId);
    return option?.label || optionId;
  };

  const getFilterIcon = (filterId) => {
    const filter = filters.find(f => f.id === filterId);
    return filter?.icon || Filter;
  };

  const activeFilters = Object.entries(selectedFilters).flatMap(([filterId, values]) =>
    values.map(value => ({
      filterId,
      value,
      label: getFilterLabel(filterId, value),
      Icon: getFilterIcon(filterId)
    }))
  );

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map(({ filterId, value, label, Icon }) => (
        <motion.span
          key={`${filterId}-${value}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300"
        >
          <Icon size={12} className="text-gray-500" />
          <span>{label}</span>
          <button
            onClick={() => onRemoveFilter(filterId, value)}
            className="ml-1 text-gray-500 hover:text-white transition-colors"
          >
            <X size={12} />
          </button>
        </motion.span>
      ))}
      
      {activeFilters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

// Quick Filter Presets
export const QuickFilters = ({ onSelect }) => {
  const presets = [
    { id: 'active-users', label: 'Active Users', icon: Users, filter: { status: ['active'] } },
    { id: 'popular-rooms', label: 'Popular Rooms', icon: TrendingUp, filter: { members: ['10+'] } },
    { id: 'recent-activity', label: 'Recent Activity', icon: Activity, filter: { created: ['today'] } },
    { id: 'needs-attention', label: 'Needs Attention', icon: AlertTriangle, filter: { status: ['blocked', 'locked'] } },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {presets.map((preset) => (
        <motion.button
          key={preset.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(preset.filter)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-xs text-gray-300 hover:text-white transition-colors"
        >
          <preset.icon size={12} />
          <span>{preset.label}</span>
        </motion.button>
      ))}
    </div>
  );
};

// Export main component and utilities
export default FilterDropdown;