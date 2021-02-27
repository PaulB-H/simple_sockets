const socket = io();

const mainSections = new Set();

// Name UI & Elements
const setNameUI = document.getElementById("set-name-ui");
mainSections.add(setNameUI);
const nameInput = document.getElementById("name-input");

const setRoomUI = document.getElementById("set-room-ui");
mainSections.add(setRoomUI);
const roomInput = document.getElementById("room-input");

const noConnUI = document.getElementById("no-conn-ui");
mainSections.add(noConnUI);

console.log(mainSections);

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
