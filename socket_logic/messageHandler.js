module.exports = (io, socket, users) => {
  socket.on("sendMessage", (message) => {
    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    console.log(`Send Message Request
Socket ID: ${currentUserObj.socketID}
Socket Username: ${currentUserObj.socketUsername}
Room #: ${currentUserObj.currentRoom}
Message: ${message}
    `);

    io.to(currentUserObj.currentRoom).emit(
      "newMessage",
      currentUserObj.socketUsername,
      message
    );
  });
};
