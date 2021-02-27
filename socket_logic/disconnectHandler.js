module.exports = (io, socket, users) => {
  socket.on("disconnecting", () => {
    console.log(`Socket: ${socket.id} left\n`);

    if (socket.username !== undefined) {
      console.log(`Username was ${socket.username}`);
      users.delete(socket.username);
    }
  });
};
