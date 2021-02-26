const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Set static folder for front-end
app.use(express.static("./client"));

// Create a server const for socket.io to use
// Normally we just do app.listen here
const server = app.listen(port, () => {
  console.log(`Listening on port: ${port} \n`);
});

// Attach socket.io to the server
const io = require("socket.io")(server);

// Import socket handlers
const registerLoginHandlers = require("./socket_logic/loginHandler.js");

const onConnection = (socket) => {
  console.log(`Socket: ${socket.id} connected \n`);

  registerLoginHandlers(io, socket);
  // We could call more socket handlers here

  socket.on("setUsername", (payload) => {
    console.log(
      `Socket: ${socket.id}\nWants to set their name to: ${payload}\n`
    );
  });

  socket.on("disconnecting", (socket) => {
    console.log(`Socket: ${socket.id} left\n`);
  });
};

io.on("connection", onConnection);

// Serves our front end
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});
