import { useEffect, useRef, useState } from 'react';
import { useSocketRef } from './useSocket';
import {
  subscribeToUserStatus,
  unsubscribeFromUserStatus,
} from './socketHelper';

export const useOnlineStatus = targetUserId => {
  const socket = useSocketRef();
  const [isOnline, setIsOnline] = useState(false);

  const watchedUserIdRef = useRef(null);

  useEffect(() => {
    if (!socket || !targetUserId) return;

    const handleOnline = userId => {
      if (userId === targetUserId) setIsOnline(true);
    };

    const handleOffline = userId => {
      if (userId === targetUserId) setIsOnline(false);
    };

    if (watchedUserIdRef.current === targetUserId) return;

    if (watchedUserIdRef.current) {
      socket.emit('unwatch-user', { targetUserId: watchedUserIdRef.current });
      unsubscribeFromUserStatus(socket, handleOnline, handleOffline);
    }

    socket.emit('watch-user', { targetUserId });
    watchedUserIdRef.current = targetUserId;

    subscribeToUserStatus(socket, handleOnline, handleOffline);

    return () => {
      unsubscribeFromUserStatus(socket, handleOnline, handleOffline);
      socket.emit('unwatch-user', { targetUserId });
      watchedUserIdRef.current = null;
    };
  }, [socket, targetUserId]);

  return isOnline;
};
