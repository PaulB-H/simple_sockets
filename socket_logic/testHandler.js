module.exports = (io, socket, users) => {
  socket.on("setUsername", (payload) => {
    console.log(
      `Socket: ${socket.id}\nWants to set their name to: ${payload}\n`
    );
    if (!users.has(payload)) {
      socket.username = payload;
      console.log("Name not taken, set name to: " + socket.username);
      // Setup emit to client with name
    } else {
      console.log("Name taken");
      // Setup emit to client with error
    }
  });
};
