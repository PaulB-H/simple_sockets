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

const registerTestHandlers = require("./socket_logic/testHandler.js");

// const registerLoginHandlers = require("./socket_logic/loginHandler.js");

const onConnection = (socket) => {
  console.log(`Socket: ${socket.id} connected \n`);

  // Test Handlers
  registerTestHandlers(io, socket);

  // Login Handlers
  // registerLoginHandlers(io, socket);

  socket.on("disconnecting", (socket) => {
    console.log(`Socket: ${socket.id} left\n`);
  });
};

io.on("connection", onConnection);

// Serves our front end
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});
