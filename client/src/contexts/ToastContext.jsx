/**
 * Toast notification context
 * Provides global toast notification system with proper cleanup
 */

import React, { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { TOAST_DURATION } from '../utils/constants';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toastData) => {
    const id = nanoid();
    const newToast = {
      id,
      duration: TOAST_DURATION,
      autoDismiss: true,
      ...toastData,
    };

    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto-dismiss if enabled
    if (newToast.autoDismiss) {
      setTimeout(() => {
        setToasts((currentToasts) => 
          currentToasts.filter((toast) => toast.id !== id)
        );
      }, newToast.duration);
    }

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Toast component that will be rendered by App component
  const ToastContainer = useCallback(() => {
    return (
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
        {toasts.map((toast) => {
          const bgColor = {
            success: 'bg-green-600',
            error: 'bg-red-600',
            warning: 'bg-yellow-600',
            info: 'bg-blue-600',
          }[toast.type] || 'bg-gray-800';

          return (
            <div
              key={toast.id}
              className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 animate-slide-in`}
              role="alert"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{toast.message}</span>
                <button
                  onClick={() => hideToast(toast.id)}
                  className="ml-4 text-white/70 hover:text-white transition-colors"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [toasts, hideToast]);

  const contextValue = useMemo(() => ({
    showToast,
    hideToast,
    hideAllToasts,
    ToastContainer,
  }), [showToast, hideToast, hideAllToasts, ToastContainer]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export default ToastContext;