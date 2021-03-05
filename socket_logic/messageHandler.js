const validator = require("validator");

module.exports = (io, socket, users) => {
  // START sendMessage
  socket.on("sendMessage", (message) => {
    let currentUserObj;

    if (!socket) return;
    if (!socket.id) return;
    if (!users) return;

    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      } else {
        console.log("Auth Error");
        return;
      }
    });

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

    if (!currentUserObj) return;
    if (!currentUserObj.currentRoom) return;

    io.to(currentUserObj.currentRoom).emit(
      "newMessage",
      currentUserObj.socketUsername,
      message
    );
  });
  // END sendMessage
};
