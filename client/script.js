const socket = io();

const mainSections = new Set();
const errorDivs = new Set();

// Set Name UI & Elements
const setNameUI = document.getElementById("set-name-ui");
mainSections.add(setNameUI);
const setNameInput = document.getElementById("set-name-input");
const setNameError = document.getElementById("set-name-error");
errorDivs.add(setNameError);

// Join or Create Room UI & Elements
const joinCreateUI = document.getElementById("join-create-ui");
mainSections.add(joinCreateUI);
const joinRoomInputNum = document.getElementById("join-create-inputNum");
const joinRoomInputPass = document.getElementById("join-create-inputPass");
const joinRoomError = document.getElementById("join-create-error");
errorDivs.add(joinRoomError);

const noConnOverlay = document.getElementById("no-conn-overlay");
mainSections.add(noConnOverlay);

errorDivs.forEach((elem) => {
  if (!elem.classList.contains("d-none")) elem.classList.add("d-none");
});

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
  const nameValue = setNameInput.value;
  socket.emit("setUsername", nameValue);
};

socket.on("nameSet", (payload) => {
  console.log(`Name set to ${payload}`);
  hideMainSections();
  joinCreateUI.classList.remove("d-none");
});

socket.on("nameTaken", () => {
  console.log("Name taken");
});

socket.on("alreadyName", () => {
  console.log("That already is my name...");
});

const reqJoinRoom = () => {
  const roomNum = joinRoomInputNum.value;
  const roomPass = joinRoomInputPass.value;
  console.log(
    `Requesting to join room # ${roomNum} ${
      roomPass !== "" ? "with a" : "without a"
    } password`
  );
  socket.emit("reqJoinRoom", roomNum, roomPass === "" ? null : roomPass);
};

socket.on("room404", () => {
  joinRoomError.innerText = "Error: Room not found";
});

socket.on("disconnect", () => {
  console.log("Disconnect");
  hideMainSections();
  noConnOverlay.classList.remove("d-none");
});
