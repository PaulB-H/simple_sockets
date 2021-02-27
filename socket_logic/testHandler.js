module.exports = (io, socket) => {
  socket.on("setUsername", (payload) => {
    console.log(
      `Socket: ${socket.id}\nWants to set their name to: ${payload}\n`
    );
  });
};
