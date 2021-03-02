const validator = require("validator");

module.exports = (io, socket, users, rooms) => {
  // START reqJoinRoom
  socket.on("reqJoinRoom", (reqRoomNum, pass) => {
    console.log(`
Join Room Request
Socket ID: ${socket.id}
Room #: ${reqRoomNum}
Password: ${pass === null ? "None" : "Included"}
    `);

    reqRoomNum = validator.escape(reqRoomNum);

    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (currentUserObj.socketUsername === undefined) {
      console.log("DENIED: No username\n");
      return;
    }

    // START rooms.size > 0
    if (rooms.size > 0) {
      let roomExists = false;

      rooms.forEach((room) => {
        // Check for matching room num
        if (room.roomNum === reqRoomNum) {
          console.log("Room exists\n");
          roomExists = true;

          if (room.pass !== pass) {
            console.log("Pass not match");
            socket.emit("passNotMatch"); // Not handled yet
            return;
          }

          console.log(
            `ACCEPTED: \nsocket.username: ${socket.username} \nJoined room #: ${reqRoomNum} \n`
          );
          socket.join(`${reqRoomNum}`);

          currentUserObj.currentRoom = reqRoomNum;
          room.users.push(socket.username);

          socket.emit("joinSuccess", room.roomNum);

          io.to(room.roomNum).emit("updateUsers", room.users);
        }
      });

      if (roomExists === false) {
        console.log("DENIED: Room does not exist\n");
        socket.emit("room404");
      }
    }
  });
  // END reqJoinRoom

  // START reqCreateRoom
  socket.on("reqCreateRoom", (reqRoomNum, pass) => {
    console.log(`Room Creation Request
Socket ID: ${socket.id}
Room #: ${reqRoomNum}
Password: ${pass === null ? "None" : "Included"}
    `);

    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (socket.username === undefined) {
      console.log("DENIED: No username\n");
      return;
    }

    let roomExists = false;

    // If there are rooms at all
    if (rooms.size > 0) {
      rooms.forEach((room) => {
        // Check for matching room num
        if (room.roomNum === reqRoomNum) {
          console.log("DENIED: Room exists\n");
          roomExists = true;
          socket.emit("roomAlreadyExists");
        }
      });
    }

    if (!roomExists) {
      console.log(`ACCEPTED: \nRoom # ${reqRoomNum} created \n`);

      // Join socket to room
      socket.join(`${reqRoomNum}`);

      currentUserObj.currentRoom = reqRoomNum;

      let newRoom = {
        roomNum: reqRoomNum,
        pass: pass,
        users: new Array(currentUserObj.socketUsername),
      };

      // Add room to server rooms set
      rooms.add(newRoom);

      // Tell socket room was created
      socket.emit("roomCreated", newRoom);
    }
  });
  // END reqCreateRoom
};
