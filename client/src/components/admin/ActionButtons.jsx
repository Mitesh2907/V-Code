// src/components/admin/ActionButtons.jsx
import { motion } from 'framer-motion';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Eye, 
  XCircle,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Save,
  Settings,
  Copy,
  Lock,
  Unlock,
  UserX,
  UserCheck,
  Mail,
  Archive,
  AlertTriangle
} from 'lucide-react';
import { useState } from 'react';

// Base Action Button
export const ActionButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const variants = {
    default: 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white focus:ring-gray-600 border border-gray-700',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
    ghost: 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white focus:ring-gray-600',
  };

  const sizes = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-2.5 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {loading ? (
        <RefreshCw size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} className="animate-spin" />
      ) : (
        Icon && <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
      )}
      {label && <span>{label}</span>}
    </motion.button>
  );
};

// Icon Button (Circular)
export const IconButton = ({ 
  onClick, 
  icon: Icon, 
  tooltip, 
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseStyles = 'relative inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900';
  
  const variants = {
    default: 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-gray-600',
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500',
    ghost: 'bg-transparent text-gray-400 hover:bg-gray-800 hover:text-white focus:ring-gray-600',
  };

  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      >
        <Icon size={iconSizes[size]} />
      </motion.button>
      
      {/* Tooltip */}
      {tooltip && showTooltip && !disabled && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-md whitespace-nowrap -top-8 left-1/2 transform -translate-x-1/2 border border-gray-800"
        >
          {tooltip}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-800 rotate-45" />
        </motion.div>
      )}
    </div>
  );
};

// Action Group (for table rows)
export const ActionGroup = ({ 
  actions,
  size = 'md',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-end gap-1 ${className}`}>
      {actions.map((action, index) => (
        <IconButton
          key={index}
          icon={action.icon}
          onClick={action.onClick}
          tooltip={action.tooltip}
          variant={action.variant || 'ghost'}
          size={size}
          disabled={action.disabled}
        />
      ))}
    </div>
  );
};

// Bulk Actions Bar
export const BulkActionsBar = ({
  selectedCount,
  onClear,
  actions,
  className = ''
}) => {
  if (selectedCount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
    >
      <div className="flex items-center gap-4 px-4 py-3 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl backdrop-blur-xl">
        <span className="text-sm text-white font-medium">
          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
        </span>
        
        <div className="w-px h-6 bg-gray-800" />
        
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
              variant={action.variant || 'ghost'}
              size="sm"
            />
          ))}
        </div>
        
        <div className="w-px h-6 bg-gray-800" />
        
        <IconButton
          icon={XCircle}
          onClick={onClear}
          tooltip="Clear selection"
          variant="ghost"
          size="sm"
        />
      </div>
    </motion.div>
  );
};

// Quick Action Menu
export const QuickActionMenu = ({
  isOpen,
  onClose,
  actions,
  position = 'bottom-right',
  className = ''
}) => {
  if (!isOpen) return null;

  const positions = {
    'bottom-right': 'top-full right-0 mt-2',
    'bottom-left': 'top-full left-0 mt-2',
    'top-right': 'bottom-full right-0 mb-2',
    'top-left': 'bottom-full left-0 mb-2',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`absolute z-50 min-w-[180px] bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden ${positions[position]} ${className}`}
    >
      <div className="p-1">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ x: 4 }}
            onClick={() => {
              action.onClick();
              onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              action.variant === 'danger' 
                ? 'text-rose-400 hover:bg-rose-500/10' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <action.icon size={16} />
            <span>{action.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

// Export all action button variants
export const ActionButtons = {
  // User actions
  View: (props) => <IconButton icon={Eye} tooltip="View" variant="ghost" {...props} />,
  Edit: (props) => <IconButton icon={Edit} tooltip="Edit" variant="primary" {...props} />,
  Delete: (props) => <IconButton icon={Trash2} tooltip="Delete" variant="danger" {...props} />,
  
  // User status actions
  Block: (props) => <IconButton icon={Ban} tooltip="Block User" variant="warning" {...props} />,
  Unblock: (props) => <IconButton icon={CheckCircle} tooltip="Unblock User" variant="success" {...props} />,
  Suspend: (props) => <IconButton icon={UserX} tooltip="Suspend" variant="danger" {...props} />,
  Activate: (props) => <IconButton icon={UserCheck} tooltip="Activate" variant="success" {...props} />,
  
  // Room actions
  Close: (props) => <IconButton icon={XCircle} tooltip="Close Room" variant="warning" {...props} />,
  Archive: (props) => <IconButton icon={Archive} tooltip="Archive" variant="default" {...props} />,
  
  // Content actions
  Copy: (props) => <IconButton icon={Copy} tooltip="Copy" variant="ghost" {...props} />,
  Download: (props) => <IconButton icon={Download} tooltip="Download" variant="default" {...props} />,
  Upload: (props) => <IconButton icon={Upload} tooltip="Upload" variant="primary" {...props} />,
  
  // Navigation/Utility
  More: (props) => <IconButton icon={MoreVertical} tooltip="More options" variant="ghost" {...props} />,
  Refresh: (props) => <IconButton icon={RefreshCw} tooltip="Refresh" variant="ghost" {...props} />,
  Add: (props) => <IconButton icon={Plus} tooltip="Add" variant="primary" {...props} />,
  Save: (props) => <IconButton icon={Save} tooltip="Save" variant="success" {...props} />,
  Settings: (props) => <IconButton icon={Settings} tooltip="Settings" variant="ghost" {...props} />,
  Lock: (props) => <IconButton icon={Lock} tooltip="Lock" variant="warning" {...props} />,
  Unlock: (props) => <IconButton icon={Unlock} tooltip="Unlock" variant="success" {...props} />,
  Mail: (props) => <IconButton icon={Mail} tooltip="Send Email" variant="primary" {...props} />,
  Warn: (props) => <IconButton icon={AlertTriangle} tooltip="Send Warning" variant="danger" {...props} />,
};

export default ActionButtons;