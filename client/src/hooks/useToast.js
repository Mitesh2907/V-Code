/**
 * Custom hook for showing toast notifications
 * Provides a clean API for different toast types
 */

import { useContext, useCallback } from 'react';
import ToastContext from '../contexts/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  const { showToast, hideToast, hideAllToasts } = context;

  const success = useCallback((message, options = {}) => {
    return showToast({ type: 'success', message, ...options });
  }, [showToast]);

  const error = useCallback((message, options = {}) => {
    return showToast({ type: 'error', message, ...options });
  }, [showToast]);

  const warning = useCallback((message, options = {}) => {
    return showToast({ type: 'warning', message, ...options });
  }, [showToast]);

  const info = useCallback((message, options = {}) => {
    return showToast({ type: 'info', message, ...options });
  }, [showToast]);

  return {
    success,
    error,
    warning,
    info,
    hideToast,
    hideAllToasts,
  };
};