const validator = require("validator");

module.exports = (io, socket, users) => {
  // START sendMessage
  socket.on("sendMessage", (message) => {
    console.log(`Message Request from\n${socket.id}`);

    let currentUserObj = null;

    if (!socket) return;
    if (!socket.id) return;
    if (!users) return;

    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (!currentUserObj) {
      console.log("Auth Error");
      return;
    }

    if (!currentUserObj.currentRoom) {
      // User not in a room
      return;
    }

    // Check for empty string or not string
    if (message === "" || typeof message !== "string") {
      socket.emit("noMessageFound");
      return;
    } else {
      message = validator.escape(message);
      message.trim();
    }

    //     console.log(`Send Message Request
    // Socket ID: ${currentUserObj.socketID}
    // Socket Username: ${currentUserObj.socketUsername}
    // Room #: ${currentUserObj.currentRoom}
    //     `);

    io.to(currentUserObj.currentRoom).emit(
      "newMessage",
      currentUserObj.socketUsername,
      message
    );
  });
  // END sendMessage
};
