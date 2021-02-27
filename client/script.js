const socket = io();

const mainSections = new Set();

// Name UI & Elements
const setNameUI = document.getElementById("set-name-ui");
mainSections.add(setNameUI);
const nameInput = document.getElementById("name-input");

const setRoomUI = document.getElementById("set-room-ui");
mainSections.add(setRoomUI);
const roomInput = document.getElementById("room-input");

console.log(mainSections);

const setUsername = () => {
  const nameValue = nameInput.value;
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

const setRoom = () => {
  const roomValue = roomInput.value;
  socket.emit("setRoom", roomValue);
};

socket.on("disconnect", () => {
  console.log("Disconnect");
  mainSections.forEach((element) => {
    if (!element.classList.contains("d-none")) {
      element.classList.add("d-none");
    }
  });
});
