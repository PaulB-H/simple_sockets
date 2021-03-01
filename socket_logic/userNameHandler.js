const validator = require("validator");

module.exports = (io, socket, users) => {
  socket.on("setUsername", (newUserName) => {
    console.log(`Set Username Request
Socket ID: ${socket.id}
username: ${newUserName}
    `);

    newUserName = escape(newUserName);

    let acceptRequest = true;

    if (socket.username !== undefined) {
      console.log(`DENIED: Socket already has username\n`);
      socket.emit("alreadyName");
      acceptRequest = false;
    }

    users.forEach((user) => {
      if (user.socketUsername === newUserName) {
        acceptRequest = false;
        socket.emit("nameTaken");
      }
    });

    if (acceptRequest) {
      console.log(
        `ACCEPTED: \nSocket ID: ${socket.id} \nSet socket.username: ${newUserName}\n`
      );

      socket.username = newUserName;

      users.add({
        socketID: socket.id,
        socketUsername: newUserName,
        currentRoom: null,
      });

      socket.emit("nameSet", socket.username);
    }
  });
};
