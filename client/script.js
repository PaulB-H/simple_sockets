const socket = io();

const mainSections = new Set();
const errorDivs = new Set();

// Set Name UI & Elements
const setNameUI = document.getElementById("set-name-ui");
mainSections.add(setNameUI);
const setNameInput = document.getElementById("set-name-input");
const setNameError = document.getElementById("set-name-error");
errorDivs.add(setNameError);

// Join Room UI & Elements
const setRoomUI = document.getElementById("join-room-ui");
mainSections.add(setRoomUI);
const joinRoomInputNum = document.getElementById("join-room-inputNum");
const joinRoomInputPass = document.getElementById("join-room-inputPass");
const joinRoomError = document.getElementById("join-room-error");
errorDivs.add(joinRoomError);

// Create Room UI & Elements
const createRoomUI = document.getElementById("create-room-ui");
mainSections.add(createRoomUI);
const createRoomInputNum = document.getElementById("create-room-inputNum");
const createRoomInputPass = document.getElementById("create-room-inputPass");
const createRoomError = document.getElementById("create-room-error");
errorDivs.add(createRoomError);

const noConnOverlay = document.getElementById("no-conn-overlay");
mainSections.add(noConnOverlay);

function hideMainSections() {
  mainSections.forEach((elem) => {
    if (!elem.classList.contains("d-none")) {
      elem.classList.add("d-none");
    }
  });
}

socket.on("connected", () => {
  console.log("Connected");
  hideMainSections();
  setNameUI.classList.remove("d-none");
});

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

const reqJoinRoom = () => {
  const roomNum = roomInput.value;
  socket.emit("reqJoinRoom", roomNum);
};

socket.on("disconnect", () => {
  console.log("Disconnect");
  hideMainSections();
  setNameUI.classList.remove("d-none");
  noConnUI.classList.remove("d-none");
});
