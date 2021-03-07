module.exports = (io, socket, users, rooms, roomList) => {
  // START disconnecting

  /*
    This maybe should be changed to a "disconnected" event
  */
  socket.on("disconnecting", () => {
    console.log(`Socket: ${socket.id} is disconnecting\n`);

    let currentUserObj;
    users.forEach((user) => {
      if (user.socketID === socket.id) {
        currentUserObj = user;
      }
    });

    if (currentUserObj && currentUserObj.currentRoom !== null) {
      rooms.forEach((room) => {
        if (room.roomNum === currentUserObj.currentRoom) {
          // console.log("Found room user was in");

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
    }

    users.forEach((user) => {
      if (user.socketID === socket.id) {
        users.delete(user);
      }
    });
  });
  // END disconnecting
};
