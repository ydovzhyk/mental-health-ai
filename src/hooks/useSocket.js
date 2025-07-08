import io from 'socket.io-client';

const serverURL = 'http://localhost:4000';
// const serverURL = 'wss://test-task-backend-34db7d47d9c8.herokuapp.com';

export let socketRef = null;
let isInitialized = false;

const subscriptions = [
  'new-message',
  'user-online',
  'user-offline',
  'user-new-message',
];

export const initialize = (userId, onUserNewMessage) => {
  if (isInitialized || !userId) return;

  socketRef = io(serverURL, {
    query: { userId },
  });

  socketRef.on('connect', () => {
    console.log('🟢 WebSocket connected');
  });

  socketRef.on('disconnect', () => {
    console.log('🔴 WebSocket disconnected');
  });

  subscriptions.forEach(event => {
    socketRef.on(event, payload => {
      console.log(`📥 Event: ${event}`, payload);
    });
  });

  if (typeof onUserNewMessage === 'function') {
    socketRef.on('user-new-message', () => {
      onUserNewMessage();
    });
  }

  isInitialized = true;
};

export const disconnect = () => {
  if (socketRef) {
    subscriptions.forEach(event => {
      socketRef.off(event);
    });
    socketRef.disconnect();
    socketRef = null;
    isInitialized = false;
    console.log('🛑 WebSocket disconnected manually');
  }
};

export const sendMessage = (userId, chatId, messageText, callback) => {
  if (socketRef) {
    socketRef.emit(
      'message',
      { chatId, senderId: userId, text: messageText },
      (error, response) => {
        if (error || !response || !response.info) return;
        if (typeof callback === 'function') callback(error, response);
      }
    );
  }
};

export const createChat = (userId, ownerId, apartmentId, callback) => {
  if (socketRef) {
    socketRef.emit('create-chat', { userId, ownerId, apartmentId }, callback);
  }
};

export const checkChat = (userId, ownerId, apartmentId, callback) => {
  if (socketRef) {
    socketRef.emit('check-chat', { userId, ownerId, apartmentId }, callback);
  }
};

export const getConversation = (chatId, callback) => {
  if (socketRef) {
    socketRef.emit('conversation', { chatId }, (error, response) => {
      if (error || !response?.messages || !response?.chat) return;
      if (typeof callback === 'function') {
        callback(response.messages, response.chat);
      }
    });
  }
};

export const getOwnerInfo = (ownerId, callback) => {
  if (socketRef) {
    socketRef.emit('owner-avatar', { ownerId }, callback);
  }
};

export const clearNewMessages = (chatId, field, userId, callback) => {
  if (socketRef) {
    socketRef.emit('clear-new-messages', { chatId, field, userId }, callback);
  }
};

export const getSocketUtils = () => ({
  initialize,
  disconnect,
  sendMessage,
  createChat,
  checkChat,
  getConversation,
  getOwnerInfo,
  clearNewMessages,
});

export const useSocketRef = () => socketRef;

const useSocket = () => getSocketUtils();
export default useSocket;
