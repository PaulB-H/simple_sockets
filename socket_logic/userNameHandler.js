const validator = require("validator");
const Filter = require("bad-words");
const filter = new Filter();

module.exports = (io, socket, users) => {
  // START setUserNames
  socket.on("setUsername", (newUserName) => {
    if (typeof newUserName !== "string" || newUserName === "") {
      // console.log(`DENIED: Request contains no username\n`);
      socket.emit("userNameEmpty");
      return;
    }

    newUserName = validator.escape(newUserName);

    if (filter.isProfane(newUserName)) return;

    //     console.log(`Set Username Request
    // Socket ID: ${socket.id}
    // username: ${newUserName}
    //     `);

    let acceptRequest = true;

    if (newUserName.length < 3 || newUserName.length > 25) {
      // console.log(`DENIED: newUserName not within 3 and 25 characters \n`);
      socket.emit("nameLengthErr");
      acceptRequest = false;
    }

    if (socket.username !== undefined) {
      // console.log(`DENIED: Socket already has username\n`);
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
      // console.log(
      //   `ACCEPTED: \nSocket ID: ${socket.id} \nSet socket.username: ${newUserName}\n`
      // );

      socket.username = newUserName;

      users.add({
        socketID: socket.id,
        socketUsername: newUserName,
        currentRoom: null,
      });

      socket.emit("nameSet", socket.username);
    }
  });
  // END setUserName
};
