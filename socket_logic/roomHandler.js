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
    if (rooms.size > 0) {
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
            room.users.push(socket.username);
            socket.emit("joinSuccess", room);
          }
        }
      });

      if (roomExists === false) {
        console.log("DENIED: Room does not exist\n");
        socket.emit("room404");
      }
    } else {
      // rooms.size is <= 0
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

      let newRoom = {
        roomNum: reqRoomNum,
        pass: pass,
        users: new Array(socket.username),
      };

      // Add room to server rooms set
      rooms.add(newRoom);

      // Tell socket room was created
      socket.emit("roomCreated", newRoom);
    }
  });
};
