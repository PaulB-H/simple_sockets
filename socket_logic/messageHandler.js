const validator = require("validator");

module.exports = (io, socket, users) => {
  // START sendMessage
  socket.on("sendMessage", (message) => {
    if (message === "" || typeof message !== "string") {
      socket.emit("noMessageFound");
      return;
    } else if (!message.trim()) {
      socket.emit("noMessageFound");
      return;
    } else {
      message = validator.escape(message);
    }

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
    `);

    io.to(currentUserObj.currentRoom).emit(
      "newMessage",
      currentUserObj.socketUsername,
      message
    );
  });
  // END sendMessage
};
