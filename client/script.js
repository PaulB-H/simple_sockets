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

// Room list
const roomListUI = document.getElementById("room-list-ui");
mainSections.add(roomListUI);
const roomListUL = document.getElementById("room-list-ul");
const roomListError = document.getElementById("room-list-error");
errorDivs.add(roomListError);

// Chat Room UI
const chatRoomUI = document.getElementById("chat-room-ui");
mainSections.add(chatRoomUI);
const chatRoomNum = document.getElementById("chat-room-num");
const chatRoomUsers = document.getElementById("chat-room-users");
const chatRoomError = document.getElementById("chat-room-error");
errorDivs.add(chatRoomError);
const chatRoomMessages = document.getElementById("chat-room-messages");
const msgInputAndSendWrapper = document.getElementById(
  "msg-input-and-send-wrapper"
);
const chatRoomMsgInput = document.getElementById("chat-room-msg-input");

const noConnOverlay = document.getElementById("no-conn-overlay");
mainSections.add(noConnOverlay);

let hideErrorTimeout;

const scrollBottom = () => {
  msgInputAndSendWrapper.scrollIntoView(false);
  console.log("scrollhit");
};

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

function showJoinCreateUI() {
  hideMainSections();
  joinCreateUI.classList.remove("d-none");
}

function showRoomList() {
  hideMainSections();
  roomListUI.classList.remove("d-none");
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

socket.on("userNameEmpty", () => {
  console.log("DENIED: Sent request without username");

  setNameError.classList.remove("d-none");

  clearErrorTimeout();

  setNameError.innerText = "Error: Please enter a username";

  startHideErrorTimeout();
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

socket.on("roomRequiresPass", () => {
  joinCreateError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: Room requires password";
  startHideErrorTimeout();
});

socket.on("passNotNeeded", () => {
  joinCreateError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: Room does not require password";
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

socket.on("roomCreated", (roomNum, createdBy) => {
  console.log(`Room # ${roomNum} was created`);

  hideMainSections();

  chatRoomNum.innerText = roomNum;

  chatRoomUsers.innerText += `Creator: ${createdBy} |`;

  chatRoomUI.classList.remove("d-none");
});

socket.on("roomAlreadyExists", () => {
  joinCreateError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: Room already exists";
  startHideErrorTimeout();
});

const sendMessage = () => {
  const message = chatRoomMsgInput.value.trim();
  socket.emit("sendMessage", message);
  chatRoomMsgInput.style.height = "36px";
  chatRoomMsgInput.value = "";
  chatRoomMsgInput.focus();

  // With the "in" operator, we test whether the property exists (regardless of value), anywhere in window's prototype chain.
  // if ("ontouchstart" in window) {
  //   console.log("Touch enabled device");
  // } else {
  //   console.log("Non touch device");
  // }
};
chatRoomMsgInput.addEventListener("keydown", (event) => {
  let touchDevice = false;
  if ("ontouchstart" in window) {
    touchDevice = true;
  }

  if (!touchDevice && !event.shiftKey && event.key === "Enter") {
    event.preventDefault();
    sendMessage();
  }
});

socket.on("noMessageFound", () => {
  console.log("No message found in request");
  chatRoomError.classList.remove("d-none");

  clearErrorTimeout();
  chatRoomError.innerText = "Error: No message entered!";
  startHideErrorTimeout();
});

socket.on("newMessage", (userName, message) => {
  chatRoomMessages.insertAdjacentHTML(
    "afterbegin",
    `<div class="chat-msg">
      <p class="chat-msg-name">${userName}:</p>
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

socket.on("userJoined", (joinedUsername) => {
  chatRoomMessages.insertAdjacentHTML(
    "afterbegin",
    `<p class="user-left-chat" style="margin: 5px; font-size: 1.2em">User: "${joinedUsername}" has joined</p>`
  );
});

socket.on("userLeft", (leftUsername) => {
  chatRoomMessages.insertAdjacentHTML(
    "afterbegin",
    `<p class="user-left-chat" style="margin: 5px; font-size: 1.2em">User: "${leftUsername}" has left</p>`
  );
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

// Global Emits
socket.on("updateRoomList", (roomList) => {
  roomListUL.innerHTML = "";

  roomList.forEach((room) => {
    roomListUL.insertAdjacentHTML(
      "afterbegin",
      `
      <li class="room-list-li"><p>Room: <strong>${room.roomNum}</strong> | Password: <strong>${room.passReq}</strong></p><button onclick="joinRoomList(${room.roomNum})">Join room <strong>${room.roomNum}</strong></button></li>
    `
    );
  });
});
