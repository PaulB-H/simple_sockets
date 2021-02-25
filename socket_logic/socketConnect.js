module.exports = (io, socket) => {
  // Listen for io.connection event
  io.on("connection", () => {
    console.log(`Socket: ${socket.id} connected`);
  });

  // Listen for socket disconnect event
  socket.on("disconnecting", () => {
    console.log(`Socket: ${socket.id} left`);
  });

  // We could also call functions / events like this
  // io.on("connection", logSocket);
};
