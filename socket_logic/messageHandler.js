module.exports = (io, socket) => {
  socket.on("sendMessage", (message) => {
    console.log(message);
  });
};
