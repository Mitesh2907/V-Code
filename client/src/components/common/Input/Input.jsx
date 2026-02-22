import React, { forwardRef } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  fullWidth = true,
  className = '',
  icon: Icon,
  clearable = false,
  onClear,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const inputClasses = `
    w-full
    px-4
    py-3
    bg-white
    dark:bg-gray-800
    border
    rounded-lg
    transition-all
    duration-200
    text-gray-900
    dark:text-gray-100
    placeholder-gray-500
    dark:placeholder-gray-400
    focus:outline-none
    disabled:opacity-50
    disabled:cursor-not-allowed
    ${error 
      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
      : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
    }
    ${Icon || type === 'search' ? 'pl-10' : ''}
    ${clearable ? 'pr-10' : ''}
    ${className}
  `;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        {type === 'search' && !Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {clearable && props.value && isFocused && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            tabIndex={-1}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;