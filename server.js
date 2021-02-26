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
const registerLoginHandlers = require("./socket_logic/loginHandler.js");

const onConnection = (socket) => {
  console.log(`Socket: ${socket.id} connected`);

  registerLoginHandlers(io, socket);
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
