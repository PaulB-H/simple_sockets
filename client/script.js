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

// Chat Room UI
const chatRoomUI = document.getElementById("chat-room-ui");
mainSections.add(chatRoomUI);
const chatRoomNum = document.getElementById("chat-room-num");
const chatRoomUsers = document.getElementById("chat-room-users");
const chatRoomError = document.getElementById("chat-room-error");
errorDivs.add(chatRoomError);
const chatRoomMessages = document.getElementById("chat-room-messages");
const chatRoomMsgInput = document.getElementById("chat-room-msg-input");

const noConnOverlay = document.getElementById("no-conn-overlay");
mainSections.add(noConnOverlay);

let hideErrorTimeout;

const startHideErrorTimeout = () => {
  hideErrorTimeout = window.setTimeout(() => {
    errorDivs.forEach((elem) => {
      elem.classList.add("d-none");
      elem.innerText = "";
    });
  }, 3000);
};

const clearErrorTimeout = () => {
  window.clearTimeout(hideErrorTimeout);
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

  clearErrorTimeout();

  setNameError.innerText = "Error: Name taken";

  startHideErrorTimeout();
});

socket.on("alreadyName", () => {
  console.log("That already is my name...");
});

const reqJoinRoom = () => {
  const roomNum = joinCreateInputNum.value;
  const roomPass = joinCreateInputPass.value;

  if (roomNum.length === 0) {
    joinCreateError.classList.contains("d-none") &&
      joinCreateError.classList.remove("d-none");

    // Clear existing timeout
    clearErrorTimeout();

    joinCreateError.innerText = "Enter room number!";

    // Call timeout to clear err after 3 sec
    startHideErrorTimeout();

    return;
  }

  console.log(
    `Requesting to join room # ${roomNum} ${
      roomPass !== "" ? "with a" : "without a"
    } password`
  );
  socket.emit("reqJoinRoom", roomNum, roomPass === "" ? null : roomPass);
};

socket.on("joinSuccess", (roomNum) => {
  console.log(roomNum);
  hideMainSections();
  chatRoomUI.classList.remove("d-none");
  chatRoomNum.innerHTML = roomNum;
});

socket.on("passNotMatch", () => {
  joinCreateError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: Wrong password";
  startHideErrorTimeout();
});

const reqCreateRoom = () => {
  const roomNum = joinCreateInputNum.value;
  const roomPass = joinCreateInputPass.value;

  if (roomNum.length === 0) {
    joinCreateError.classList.contains("d-none") &&
      joinCreateError.classList.remove("d-none");
    clearErrorTimeout();
    joinCreateError.innerText = "Enter room number!";
    startHideErrorTimeout();
    return;
  }

  console.log(
    `Requesting to create room # ${roomNum} ${
      roomPass !== "" ? "with a" : "without a"
    } password`
  );
  socket.emit("reqCreateRoom", roomNum, roomPass === "" ? null : roomPass);
};

socket.on("roomCreated", (newRoom) => {
  console.log(`Room # ${newRoom.roomNum} was created`);

  hideMainSections();
  chatRoomNum.innerText = newRoom.roomNum;

  newRoom.users.forEach((user) => {
    chatRoomUsers.innerText += `${user} |`;
  });

  chatRoomUI.classList.remove("d-none");
});

const sendMessage = () => {
  const message = chatRoomMsgInput.value;
  socket.emit("sendMessage", message);
  chatRoomMsgInput.value = "";
};
chatRoomMsgInput.addEventListener("keyup", (event) => {
  // Number 13 is the "Enter" key on the keyboard
  if (
    event.key === 13 ||
    event.key === "Enter" ||
    event.key === "numpadEnter"
  ) {
    sendMessage();
  }
});

socket.on("newMessage", (userName, message) => {
  chatRoomMessages.insertAdjacentHTML(
    "afterbegin",
    `<div class="chat-msg">
      <p class="chat-msg-name">${userName}</p>
      <p class="chat-msg-txt">${message}</p>
    </div>`
  );
});

socket.on("updateUsers", (usersArr) => {
  chatRoomUsers.innerText = "";
  usersArr.forEach((user) => {
    chatRoomUsers.innerText += ` ${user} |`;
  });
});

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
