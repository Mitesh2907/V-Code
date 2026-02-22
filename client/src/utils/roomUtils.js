/**
 * Room-related utility functions
 * Handles room code generation and validation
 */

import { ROOM_CODE_PREFIX, ROOM_CODE_PATTERN } from './constants';

/**
 * Generate a random room code in format VC-XXXX
 * @returns {string} Generated room code
 */
export const generateRoomCode = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  return `${ROOM_CODE_PREFIX}${randomNumber}`;
};

/**
 * Validate room code format
 * @param {string} code - Room code to validate
 * @returns {{isValid: boolean, message: string}} Validation result
 */
export const validateRoomCode = (code) => {
  if (!code || typeof code !== 'string') {
    return {
      isValid: false,
      message: 'Room code is required',
    };
  }

  const trimmedCode = code.trim();
  
  if (trimmedCode.length === 0) {
    return {
      isValid: false,
      message: 'Room code cannot be empty',
    };
  }

  if (!ROOM_CODE_PATTERN.test(trimmedCode)) {
    return {
      isValid: false,
      message: 'Invalid format. Use: VC-XXXX (e.g., VC-1234)',
    };
  }

  return {
    isValid: true,
    message: 'Valid room code',
  };
};

/**
 * Check if a room exists (dummy implementation for frontend)
 * @param {string} roomCode - Room code to check
 * @returns {Promise<boolean>} Whether room exists
 */
export const checkRoomExists = async (roomCode) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // For demo purposes, accept any valid format
  const validation = validateRoomCode(roomCode);
  if (!validation.isValid) {
    return false;
  }
  
  // In a real app, this would check with backend
  // For now, accept if it matches pattern
  return true;
};