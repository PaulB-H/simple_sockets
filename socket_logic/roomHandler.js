module.exports = (io, socket, rooms) => {
  socket.on("reqJoinRoom", (reqRoomNum, pass) => {
    console.log(`
Socket ID: ${socket.id}
reqJoinRoom() ${reqRoomNum}
${pass === undefined ? "No pass" : "Sent pass"}
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
        // Emit "roomNotExist"
      }
    } else {
      console.log("No rooms exist\n");
      // rooms.length is <= 0
      // Emit "noRooms"
    }
  });
};
