const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// NGINX serving front end static folder
// Set static folder for front-end
// app.use(express.static("./client"));

// Create a server const for socket.io to use
// Normally we just do app.listen here
const server = app.listen(port, () => {
  console.log(`Listening on port: ${port} \n`);
});

// Attach socket.io to the server
const io = require("socket.io")(server);

// Import socket handlers
const registerUserNameHandlers = require("./socket_logic/userNameHandler.js");
const registerRoomHandlers = require("./socket_logic/roomHandler.js");
const registerMessageHandlers = require("./socket_logic/messageHandler.js");
const registerDisconnectHandlers = require("./socket_logic/disconnectHandler.js");

// Server side objects
const users = new Set();
const rooms = new Set();
const roomList = new Set();

const onConnection = (socket) => {
  // console.log(`Socket: ${socket.id} connected \n`);
  socket.emit("connected");
  io.emit("updateRoomList", [...roomList]);

  // User Name Handlers
  registerUserNameHandlers(io, socket, users);

  // Room Handlers
  registerRoomHandlers(io, socket, users, rooms, roomList);

  // Message Handlers
  registerMessageHandlers(io, socket, users);

  // Disconnect Handler
  registerDisconnectHandlers(io, socket, users, rooms, roomList);
};

io.on("connection", onConnection);

// NGINX is serving our index.html directly
// app.get("/simplesockets", function (req, res) {
//   res.sendFile(path.join(__dirname, "./client/index.html"));
// });
