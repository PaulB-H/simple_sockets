const validator = require("validator");
const bcrypt = require("bcrypt");

module.exports = (io, socket, users, rooms, roomList) => {
  // START reqJoinRoom
  socket.on("reqJoinRoom", (reqRoomNum, pass) => {
    if (typeof reqRoomNum === "string" && reqRoomNum !== "") {
      reqRoomNum = validator.escape(reqRoomNum);
    } else {
      // Did not receive room num in correct format
      // console.log("Did not receive room num in correct format");
      return;
    }

    if (typeof pass === "string" && typeof pass !== "") {
      pass = validator.escape(pass);
    } else if (pass === null || pass === "") {
      pass = null;
    } else {
      // console.log("Did not receive pass in correct format");
      return;
    }

    //     console.log(`
    // Join Room Request
    // Socket ID: ${socket.id}
    // Room #: ${reqRoomNum}
    // Password: ${pass === null ? "None" : "Included"}
    //     `);

    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (currentUserObj.socketUsername === undefined) {
      // console.log("DENIED: No username\n");
      return;
    }

    if (currentUserObj.currentRoom !== null) {
      // console.log("DENIED: Already in a room\n");
      return;
    }

    // START rooms.size > 0
    if (rooms.size > 0) {
      let roomExists = false;

      rooms.forEach((room) => {
        // Check for matching room num
        if (room.roomNum === reqRoomNum) {
          // console.log("Room exists\n");
          roomExists = true;

          if (room.pass !== null) {
            if (pass === null || pass === undefined || pass === "") {
              // console.log("DENIED: No pass in request");
              return socket.emit("roomRequiresPass");
            }

            if (!bcrypt.compareSync(pass, room.pass)) {
              // console.log("DENIED: Pass not match");
              socket.emit("passNotMatch");
              return;
            }
          }

          // Emit error if user sent pass
          // && room does not require one
          if (room.pass === null && pass) {
            // console.log("DENIED: Pass not needed");
            socket.emit("passNotNeeded");
            return;
          }

          // console.log(
          //   `ACCEPTED: \nsocket.username: ${socket.username} \nJoined room #: ${reqRoomNum} \n`
          // );
          socket.join(`${reqRoomNum}`);

          currentUserObj.currentRoom = reqRoomNum;
          room.users.push(socket.username);

          socket.emit("joinSuccess", room.roomNum);

          io.to(room.roomNum).emit("updateUsers", room.users);
          io.to(room.roomNum).emit("userJoined", currentUserObj.socketUsername);
        }
      });

      if (roomExists === false) {
        // console.log("DENIED: Room does not exist\n");
        socket.emit("room404");
      }
    } else {
      // console.log("DENIED: Room does not exist\n");
      socket.emit("room404");
    }
  });
  // END reqJoinRoom

  // START reqLeaveRoom
  socket.on("reqLeaveRoom", () => {
    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (!currentUserObj) return; // Couldn't find user

    if (!currentUserObj.currentRoom) {
      // User not in a room, rejected
      return;
    } else {
      rooms.forEach((room) => {
        if (room.roomNum === currentUserObj.currentRoom) {
          room.users.forEach((user, index) => {
            if (user === currentUserObj.socketUsername) {
              // console.log("Found user, removing");
              room.users.splice(index, 1);
              io.to(room.roomNum).emit("updateUsers", room.users);
              io.to(room.roomNum).emit(
                "userLeft",
                currentUserObj.socketUsername
              );
            }
          });

          if (room.users.length === 0) {
            rooms.delete(room);

            roomList.forEach((roomListItem) => {
              if (roomListItem.roomNum === room.roomNum) {
                roomList.delete(roomListItem);
              }
            });

            io.emit("updateRoomList", [...roomList]);
          }
        }
      });

      currentUserObj.currentRoom = null;
      socket.emit("leaveRoomAccepted");
    }
  });
  // END reqLeaveRoom

  // START reqCreateRoom
  socket.on("reqCreateRoom", async (reqRoomNum, pass) => {
    if (!socket) return;
    if (!socket.id) return;

    if (typeof reqRoomNum === "string" && reqRoomNum !== "") {
      reqRoomNum = validator.escape(reqRoomNum);
    } else {
      // Did not receive reqRoomNum
      // in correct structure
      return;
    }

    if (isNaN(parseInt(reqRoomNum))) {
      // reqRoomNum === NaN
      // console.log("DENIED: reqRoomNum === NaN");
      return;
    }

    if (typeof pass === "string" && pass !== "") {
      pass = validator.escape(pass);
    } else {
      // User sent no pass OR
      // Did not receive pass
      // in correct structure
      pass = null;
    }

    //     console.log(`Room Creation Request
    // Socket ID: ${socket.id}
    // Room #: ${reqRoomNum}
    // Password: ${pass === null ? "None" : "Included"}
    //     `);

    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (socket.username === undefined) {
      // console.log("DENIED: No username\n");
      return;
    }

    let roomExists = false;

    // If there are rooms at all
    if (rooms.size > 0) {
      rooms.forEach((room) => {
        // Check for matching room num
        if (room.roomNum === reqRoomNum) {
          // console.log("DENIED: Room exists\n");
          roomExists = true;
          socket.emit("roomAlreadyExists");
        }
      });
    }

    if (!roomExists) {
      // console.log(`ACCEPTED: \nRoom # ${reqRoomNum} created \n`);

      // Join socket to room
      socket.join(`${reqRoomNum}`);

      currentUserObj.currentRoom = reqRoomNum;

      if (pass === null || pass === undefined || pass === "") {
        pass = null;
      } else {
        pass = bcrypt.hashSync(pass, 10);
      }

      let newRoom = {
        roomNum: reqRoomNum,
        pass: pass,
        users: new Array(currentUserObj.socketUsername),
      };

      // Add room to server rooms set
      rooms.add(newRoom);

      // Tell socket room was created
      socket.emit(
        "roomCreated",
        newRoom.roomNum,
        currentUserObj.socketUsername
      );

      let roomListItem = {
        roomNum: newRoom.roomNum,
        passReq: newRoom.pass ? true : false,
      };

      roomList.add(roomListItem);

      // Need to turn roomList into an array here, socket.io
      // not sending set obj properly
      io.emit("updateRoomList", [...roomList]);
    }
  });
  // END reqCreateRoom
};
