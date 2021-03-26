const socket = io();

const mainSections = new Set();
const errorDivs = new Set();

// Welcome UI
const welcomeUI = document.getElementById("welcome-ui");
mainSections.add(welcomeUI);

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

// Room List UI
const roomListUI = document.getElementById("room-list-ui");
mainSections.add(roomListUI);
const roomListUL = document.getElementById("room-list-ul");
const roomListError = document.getElementById("room-list-error");
errorDivs.add(roomListError);

// Room List Overlay
const roomListOverlay = document.getElementById("room-list-overlay");
mainSections.add(roomListOverlay);
const roomListOverlayHeader = document.getElementById(
  "room-list-overlay-header"
);
const roomListOverlayRoomNum = document.getElementById(
  "room-list-overlay-room-num"
);
const roomListOverlayInputPass = document.getElementById(
  "room-list-overlay-input-pass"
);
const roomListOverlayCancel = document.getElementById(
  "room-list-overlay-cancel"
);
const roomListOverlayJoin = document.getElementById("room-list-overlay-join");
const roomListOverlayError = document.getElementById("room-list-overlay-error");
errorDivs.add(roomListOverlayError);

// Chat Room UI
const chatRoomUI = document.getElementById("chat-room-ui");
mainSections.add(chatRoomUI);
const chatRoomNum = document.getElementById("chat-room-num");
const totalNumOnline = document.getElementById("total-num-online");
const chatRoomUsers = document.getElementById("chat-room-users");
const chatRoomError = document.getElementById("chat-room-error");
errorDivs.add(chatRoomError);
const chatRoomMessages = document.getElementById("chat-room-messages");
const msgInputAndSendWrapper = document.getElementById(
  "msg-input-and-send-wrapper"
);
const chatRoomMsgInput = document.getElementById("chat-room-msg-input");

const leaveRoomOverlay = document.getElementById("leave-room-overlay");
mainSections.add(leaveRoomOverlay);

const noConnOverlay = document.getElementById("no-conn-overlay");
mainSections.add(noConnOverlay);

const scrollBottom = () => {
  // msgInputAndSendWrapper.scrollIntoView(false);
};

const showHideBtns = document.querySelectorAll(".toggle-password");

let hidePassTimeout;
const startHidePassTimeout = () => {
  hidePassTimeout = window.setTimeout(() => {
    roomListOverlayInputPass.type = "password";
    joinCreateInputPass.type = "password";
    showHideBtns.forEach((elem) => {
      elem.innerText = "Show";
    });
  }, 10000);
};
const clearPassTimeout = () => {
  window.clearTimeout(hidePassTimeout);
};
const togglePass = () => {
  if (showHideBtns[0].innerText === "Hide") {
    clearPassTimeout();
    roomListOverlayInputPass.type = "password";
    joinCreateInputPass.type = "password";
    showHideBtns.forEach((elem) => {
      elem.innerText = "Show";
    });
  } else {
    clearPassTimeout();

    roomListOverlayInputPass.type = "text";
    joinCreateInputPass.type = "text";

    showHideBtns.forEach((elem) => {
      elem.innerText = "Hide";
    });

    startHidePassTimeout();
  }
};

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
function showSetUsername() {
  localStorage.setItem("viewedWelcomeUI", true);
  hideMainSections();
  setNameUI.classList.remove("d-none");
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
  // console.log("Connected");
  hideMainSections();
  if (!localStorage.getItem("viewedWelcomeUI")) {
    welcomeUI.classList.remove("d-none");
  } else {
    setNameUI.classList.remove("d-none");
  }
});

// Set Username

setNameInput.addEventListener("keyup", () => {
  if (setNameInput.value.length >= 26)
    setNameInput.value = setNameInput.value.slice(0, 25);
});

const setUsername = () => {
  const nameValue = setNameInput.value;
  socket.emit("setUsername", nameValue);
};
socket.on("nameSet", (payload) => {
  // console.log(`Name set to ${payload}`);
  hideMainSections();
  joinCreateUI.classList.remove("d-none");
});
socket.on("nameLengthErr", () => {
  setNameError.classList.remove("d-none");

  clearErrorTimeout();

  setNameError.innerText = "Error: 3 to 25 characters only";

  startHideErrorTimeout();
});
socket.on("nameTaken", () => {
  // console.log("Name taken");
  setNameError.classList.contains("d-none") &&
    setNameError.classList.remove("d-none");

  clearErrorTimeout();

  setNameError.innerText = "Error: Name taken";

  startHideErrorTimeout();
});
socket.on("alreadyName", () => {
  // console.log("That already is my name...");
});
socket.on("userNameEmpty", () => {
  // console.log("DENIED: Sent request without username");

  setNameError.classList.remove("d-none");

  clearErrorTimeout();

  setNameError.innerText = "Error: Please enter a username";

  startHideErrorTimeout();
});
// END Set Username

// Join Room
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

  // console.log(
  //   `Requesting to join room # ${roomNum} ${
  //     roomPass !== "" ? "with a" : "without a"
  //   } password`
  // );

  socket.emit("reqJoinRoom", roomNum, roomPass === "" ? null : roomPass);
};
socket.on("joinSuccess", (roomNum) => {
  // console.log(`Joined ${roomNum} successfully!`);
  hideMainSections();
  chatRoomUI.classList.remove("d-none");
  chatRoomNum.innerHTML = roomNum;
});
socket.on("passNotMatch", () => {
  joinCreateError.classList.remove("d-none");
  roomListOverlayError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: Wrong password";
  roomListOverlayError.innerText = "Error: Wrong password";
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
socket.on("room404", () => {
  // console.log("Received room 404");
  joinCreateError.classList.contains("d-none") &&
    joinCreateError.classList.remove("d-none");

  window.setTimeout(() => {
    joinCreateError.classList.add("d-none");
    joinCreateError.innerText = "";
  }, 3000);

  joinCreateError.innerText = "Error: Room not found";
});
// END Join Room

// Leave Room
const openLeaveConfirm = () => {
  leaveRoomOverlay.classList.remove("d-none");
};
const cancelLeaveReq = () => {
  leaveRoomOverlay.classList.add("d-none");
};
const reqLeaveRoom = () => {
  socket.emit("reqLeaveRoom");
};
socket.on("leaveRoomAccepted", () => {
  chatRoomMessages.innerHTML = "";
  chatRoomUsers.innerText = "";
  hideMainSections();
  joinCreateUI.classList.remove("d-none");
});
// END Leave Room

// Join from Room List
const joinRoomFromList = (roomNum, passReq) => {
  if (passReq) {
    // Open roomListOverlay, "pass in" room num through innerText
    roomListOverlay.classList.remove("d-none");
    roomListOverlayRoomNum.innerText = roomNum;
  } else {
    // Send join request with null password
    socket.emit("reqJoinRoom", roomNum.toString(), null);
  }
};
roomListOverlayCancel.addEventListener("click", () => {
  roomListOverlay.classList.add("d-none");
});
roomListOverlayJoin.addEventListener("click", () => {
  const roomValue = roomListOverlayRoomNum.innerText;
  const pass = roomListOverlayInputPass.value;

  socket.emit("reqJoinRoom", roomValue, pass);
});
// END Join from Room List

// Create Room
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

  // console.log(
  //   `Requesting to create room # ${roomNum} ${
  //     roomPass !== "" ? "with a" : "without a"
  //   } password`
  // );

  socket.emit("reqCreateRoom", roomNum, roomPass === "" ? null : roomPass);
};
socket.on("roomCreated", (roomNum, createdBy) => {
  // console.log(`Room # ${roomNum} was created`);

  hideMainSections();

  chatRoomNum.innerText = roomNum;

  totalNumOnline.innerText = "1";

  chatRoomUsers.innerText += `Creator: ${createdBy} |`;

  chatRoomUI.classList.remove("d-none");
});
socket.on("roomNumLenErr", () => {
  joinCreateError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: 1 to 9999 only!";
  startHideErrorTimeout();
});
socket.on("roomNumPositiveFloatErr", () => {
  joinCreateError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: Whole numbers from 1 to 9999";
  startHideErrorTimeout();
});
socket.on("roomAlreadyExists", () => {
  joinCreateError.classList.remove("d-none");

  clearErrorTimeout();
  joinCreateError.innerText = "Error: Room already exists";
  startHideErrorTimeout();
});
// END Create Room

// Send Message
const sendMessage = () => {
  const message = chatRoomMsgInput.value.trim();
  socket.emit("sendMessage", message);
  chatRoomMsgInput.style.height = "36px";
  chatRoomMsgInput.value = "";
  chatRoomMsgInput.focus();
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
  // console.log("No message found in request");
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
// END Send Message

// Global Updates
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
socket.on("updateUsers", (usersArr) => {
  totalNumOnline.innerText = "";
  chatRoomUsers.innerText = "";

  totalNumOnline.innerText = usersArr.length;

  usersArr.forEach((user) => {
    chatRoomUsers.innerText += ` ${user} |`;
  });
});
socket.on("updateRoomList", (roomList) => {
  roomListUL.innerHTML = "";

  if (roomList.length > 0) {
    roomList.forEach((room) => {
      roomListUL.insertAdjacentHTML(
        "afterbegin",
        `
        <li class="room-list-li">
          <p style="white-space: nowrap">
            Room: <strong>${room.roomNum}</strong>
          </p>

          <p style="white-space: nowrap">
            Password: <strong>${room.passReq}</strong>
          </p>
          
          <button 
            onclick="joinRoomFromList(${room.roomNum}, ${room.passReq})"
          >
            Join room <strong>${room.roomNum}</strong>
          </button>
        </li>
      `
      );
    });
  } else {
    roomListUL.insertAdjacentHTML(
      "afterbegin",
      `
        <li class="room-list-li"><p>No rooms found!</p></li>
      `
    );
  }
});

socket.on("disconnect", () => {
  chatRoomMessages.innerHTML = "";
  chatRoomUsers.innerText = "";
  // console.log("Disconnect");
  hideMainSections();
  noConnOverlay.classList.remove("d-none");
});

chatRoomUsers.addEventListener("wheel", (e) => {
  if (e.deltaY > 0) {
    chatRoomUsers.scrollLeft += 10;
  } else {
    chatRoomUsers.scrollLeft -= 10;
  }
});
