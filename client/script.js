const socket = io();

// Name UI & Elements
const setNameUI = document.getElementById("set-name-ui");
const nameDiv = document.getElementById("name-input");

const setRoomUI = document.getElementById("set-room-ui");

const setUsername = () => {
  const nameValue = nameDiv.value;
  socket.emit("setUsername", nameValue);
};

socket.on("nameSet", (payload) => {
  console.log(`Name set to ${payload}`);
  setNameUI.classList.add("d-none");
  setRoomUI.classList.remove("d-none");
});

socket.on("nameTaken", () => {
  console.log("Name taken");
});

socket.on("alreadyName", () => {
  console.log("That already is my name...");
});
