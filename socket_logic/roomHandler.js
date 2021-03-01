module.exports = (io, socket, rooms) => {
  socket.on("reqJoinRoom", (reqRoomNum, pass) => {
    console.log(`
Socket ID: ${socket.id}
reqJoinRoom() ${reqRoomNum}
Password: ${pass === null ? "None" : "Included"}
    `);

    if (socket.username === undefined) {
      console.log("Socket has no .username \nRequest denied \n");
      return;
    }

    // If there are rooms at all
    if (rooms.length > 0) {
      let roomExists = false;

      rooms.forEach((room) => {
        // Check for matching room num
        if (room.roomNum === reqRoomNum) {
          console.log("Room exists\n");

          roomExists = true;

          if (room.pass !== null) {
            // Compare room pw vs entered pw
            // if match join user
            // if not emit error
          } else {
            console.log("Room has no pass, joined user\n");
            // Join user to room
          }
        }
      });

      if (roomExists === false) {
        console.log("Room does not exist\n");
        socket.emit("room404");
      }
    } else {
      // rooms.length is <= 0
      console.log("No rooms exist\n");
      socket.emit("room404");
    }
  });

  socket.on("reqCreateRoom", (reqRoomNum, pass) => {
    console.log(`
Room Creation Request
Socket ID: ${socket.id}
Room #: ${reqRoomNum}
Password: ${pass === null ? "None" : "Included"}
    `);

    if (socket.username === undefined) {
      console.log("Socket has no .username \nRequest denied \n");
      return;
    }

    // If there are rooms at all
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        // Check for matching room num
        if (room.roomNum === reqRoomNum) {
          console.log("Room exists\n");
          socket.emit("roomAlreadyExists");
          return;
        }
      });
    }

    // Join socket to room
    socket.join(`${reqRoomNum}`);
    console.log(socket.rooms);

    // Add room to server rooms array
    rooms.push({
      roomNum: reqRoomNum,
      pass: pass,
    });

    // Tell socket room was created
    socket.emit("roomCreated", reqRoomNum);
  });
};
