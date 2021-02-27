module.exports = (io, socket) => {
  socket.on("disconnecting", (socket) => {
    console.log(`Socket: ${socket.id} left\n`);
  });
};
