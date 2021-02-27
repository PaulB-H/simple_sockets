module.exports = (io, socket, users) => {
  socket.on("reqJoinRoom", (roomNum) => {
    console.log(`Request to join ${roomNum}`);
  });
};
