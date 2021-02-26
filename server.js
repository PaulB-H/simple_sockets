const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Set static folder for front-end
app.use(express.static("./view"));

const server = app.listen(port, () => {
  console.log(`Listening on port: ${port} \n`);
});

// Attach socket.io to the server
const io = require("socket.io")(server);

// Import socket handlers
const socketConnectHandlers = require("./socket_logic/socketConnect.js");

const onConnection = (socket) => {
  console.log(`Socket: ${socket.id} connected`);

  socketConnectHandlers(io, socket);
  // We could call more socket handlers here

  socket.on("disconnecting", (socket) => {
    console.log(`Socket: ${socket.id} left`);
  });
};

io.on("connection", onConnection);

// Serves our front end
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/index.html"));
});
