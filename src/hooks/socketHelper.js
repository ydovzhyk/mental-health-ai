export const subscribeToUserStatus = (socket, onOnline, onOffline) => {
  socket.on('user-online', onOnline);
  socket.on('user-offline', onOffline);
};

export const unsubscribeFromUserStatus = (socket, onOnline, onOffline) => {
  socket.off('user-online', onOnline);
  socket.off('user-offline', onOffline);
};
