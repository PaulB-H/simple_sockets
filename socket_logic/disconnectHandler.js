module.exports = (io, socket) => {
  socket.on("disconnecting", () => {
    console.log(`Socket: ${socket.id} left\n`);
  });
};
