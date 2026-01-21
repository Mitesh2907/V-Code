/**
 * Input validation utilities
 * Centralized validation logic for consistent error messages
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {{isValid: boolean, message: string}} Validation result
 */
export const validateEmail = (email) => {
  if (!email) {
    return {
      isValid: false,
      message: 'Email is required',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{isValid: boolean, message: string}} Validation result
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      message: 'Password is required',
    };
  }

  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Password must be at least 8 characters',
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Password must contain at least one number',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {{isValid: boolean, message: string}} Validation result
 */
export const validateUsername = (username) => {
  if (!username) {
    return {
      isValid: false,
      message: 'Username is required',
    };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters',
    };
  }

  if (username.length > 20) {
    return {
      isValid: false,
      message: 'Username must be less than 20 characters',
    };
  }

  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, underscores, and hyphens',
    };
  }

  return {
    isValid: true,
    message: '',
  };
};