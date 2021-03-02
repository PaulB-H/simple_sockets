const validator = require("validator");

module.exports = (io, socket, users) => {
  // START sendMessage
  socket.on("sendMessage", (message) => {
    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    message = validator.escape(message);
    console.log(validator);

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
  // END sendMessage
};
