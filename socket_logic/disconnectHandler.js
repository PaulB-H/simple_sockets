module.exports = (io, socket, users, rooms) => {
  // START disconnecting
  socket.on("disconnecting", () => {
    console.log(`Socket: ${socket.id} left\n`);

    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (currentUserObj && currentUserObj.currentRoom !== null) {
      rooms.forEach((room) => {
        if (room.roomNum === currentUserObj.currentRoom) {
          console.log("Found room user was in");
          room.users.forEach((user, index) => {
            if (user === currentUserObj.socketUsername) {
              console.log("Found user, cutting out");
              room.users.splice(index, 1);
              io.to(room.roomNum).emit("updateUsers", room.users);
              io.to(room.roomNum).emit(
                "userLeft",
                currentUserObj.socketUsername
              );
            }
          });
          console.log(room.users);
        }
      });
    }

    users.delete(currentUserObj);
  });
  // END disconnecting
};
