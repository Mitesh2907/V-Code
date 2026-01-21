/**
 * Simplified room management hook
 * Now mainly handles room state and utilities
 */

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './useToast';

export const useRoom = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const copyRoomCode = useCallback(async (roomCode) => {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success('Room code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy room code:', error);
      toast.error('Failed to copy room code. Please copy manually.');
    }
  }, [toast]);

  const copyShareableUrl = useCallback(async (roomCode) => {
    try {
      const shareableUrl = `${window.location.origin}/join?room=${roomCode}`;
      await navigator.clipboard.writeText(shareableUrl);
      toast.success('Shareable URL copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy shareable URL:', error);
      toast.error('Failed to copy URL. Please copy manually.');
    }
  }, []);

  const navigateToEditor = useCallback((roomCode) => {
    navigate(`/editor?room=${roomCode}`);
  }, [navigate]);

  const leaveRoom = useCallback(() => {
    if (window.confirm('Are you sure you want to leave this room?')) {
      sessionStorage.removeItem('currentRoom');
      navigate('/');
      toast.info('You have left the room');
    }
  }, [navigate, toast]);

  return {
    // Actions
    copyRoomCode,
    copyShareableUrl,
    navigateToEditor,
    leaveRoom,
  };
};