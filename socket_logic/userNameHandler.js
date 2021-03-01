module.exports = (io, socket, users) => {
  socket.on("setUsername", (payload) => {
    console.log(`Set Username Request
Socket ID: ${socket.id}
username: ${payload}
    `);

    if (socket.username !== undefined) {
      console.log(`DENIED: socket.username already exists\n`);
      socket.emit("alreadyName");
    } else if (!users.has(payload)) {
      socket.username = payload;

      users.add(payload);

      console.log(
        `ACCEPTED: \nSet ${socket.id} \nsocket.username to: ${payload}\n`
      );

      socket.emit("nameSet", socket.username);
    } else {
      console.log(`DENIED: Name exists\n`);
      socket.emit("nameTaken");
    }
  });
};
