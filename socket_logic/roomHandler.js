module.exports = (io, socket, rooms) => {
  socket.on("reqJoinRoom", (reqRoomNum, pass) => {
    console.log(`
Join Room Request
Socket ID: ${socket.id}
Room #: ${reqRoomNum}
Password: ${pass === null ? "None" : "Included"}
    `);

    if (socket.username === undefined) {
      console.log("DENIED: No username\n");
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
            console.log(
              `ACCEPTED: \nsocket.username: ${socket.username} \nJoined room #: ${reqRoomNum} \n`
            );
            socket.join(`${reqRoomNum}`);
            socket.emit("joinSuccess", reqRoomNum);
          }
        }
      });

      if (roomExists === false) {
        console.log("DENIED: Room does not exist\n");
        socket.emit("room404");
      }
    } else {
      // rooms.length is <= 0
      console.log("DENIED: No rooms exist\n");
      socket.emit("room404");
    }
  });

  socket.on("reqCreateRoom", (reqRoomNum, pass) => {
    console.log(`Room Creation Request
Socket ID: ${socket.id}
Room #: ${reqRoomNum}
Password: ${pass === null ? "None" : "Included"}
    `);

    if (socket.username === undefined) {
      console.log("DENIED: No username\n");
      return;
    }

    // If there are rooms at all
    if (rooms.length > 0) {
      rooms.forEach((room) => {
        // Check for matching room num
        if (room.roomNum === reqRoomNum) {
          console.log("DENIED: Room exists\n");
          socket.emit("roomAlreadyExists");
          return;
        }
      });
    }

    console.log(`ACCEPTED: \nRoom # ${reqRoomNum} created \n`);

    // Join socket to room
    socket.join(`${reqRoomNum}`);

    // Add room to server rooms array
    rooms.push({
      roomNum: reqRoomNum,
      pass: pass,
    });

    // Tell socket room was created
    socket.emit("roomCreated", reqRoomNum);
  });
};
