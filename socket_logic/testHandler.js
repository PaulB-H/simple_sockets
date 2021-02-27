module.exports = (io, socket, users) => {
  socket.on("setUsername", (payload) => {
    console.log(
      `Socket: ${socket.id} \nwants to set their socket.username to: ${payload}`
    );

    if (socket.username === payload) {
      console.log(`Their name is already ${payload}...\n`);

      socket.emit("alreadyName");
    } else if (!users.has(payload)) {
      socket.username = payload;

      users.add(payload);

      console.log(
        `${socket.id}'s request accepted \nSet socket.username to ${payload}\n`
      );

      socket.emit("nameSet", socket.username);
    } else {
      console.log(`${socket.id}'s request denied, name exists\n`);

      socket.emit("nameTaken");
    }
  });
};
