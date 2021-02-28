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
const joinCreateInputNum = document.getElementById("join-create-inputNum");
const joinCreateInputPass = document.getElementById("join-create-inputPass");
const joinCreateError = document.getElementById("join-create-error");
errorDivs.add(joinCreateError);

const noConnOverlay = document.getElementById("no-conn-overlay");
mainSections.add(noConnOverlay);

const timeouts = new Set();
const clearAllTimeouts = () => {
  timeouts.forEach((timeout) => {
    window.clearTimeout(timeout);
  });
};

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
  setNameError.classList.contains("d-none") &&
    setNameError.classList.remove("d-none");

  window.setTimeout(() => {
    setNameError.classList.add("d-none");
    setNameError.innerText = "";
  }, 3000);

  setNameError.innerText = "Error: Name taken";
});

socket.on("alreadyName", () => {
  console.log("That already is my name...");
});

const reqJoinRoom = () => {
  const roomNum = joinCreateInputNum.value;
  const roomPass = joinCreateInputPass.value;
  console.log(
    `Requesting to join room # ${roomNum} ${
      roomPass !== "" ? "with a" : "without a"
    } password`
  );
  socket.emit("reqJoinRoom", roomNum, roomPass === "" ? null : roomPass);
};

socket.on("room404", () => {
  console.log("Received room 404");
  joinCreateError.classList.contains("d-none") &&
    joinCreateError.classList.remove("d-none");

  window.setTimeout(() => {
    joinCreateError.classList.add("d-none");
    joinCreateError.innerText = "";
  }, 3000);

  joinCreateError.innerText = "Error: Room not found";
});

socket.on("disconnect", () => {
  console.log("Disconnect");
  hideMainSections();
  noConnOverlay.classList.remove("d-none");
});
