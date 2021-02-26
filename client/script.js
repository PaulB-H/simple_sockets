const socket = io();

// Name UI & Elements
const setNameUI = document.getElementById("set-name-ui");
const nameDiv = document.getElementById("name-input");

const setUsername = () => {
  const nameValue = nameDiv.value;
  socket.emit("setUsername", nameValue);
};
