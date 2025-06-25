const socket = io();

const welcome = document.getElementById('welcome');
const nicknameForm = document.getElementById('nickname');
const enter = document.getElementById('enter');
const room = document.getElementById('room');

enter.hidden = true;
room.hidden = true;

let nickname;
let roomName;

function addMessage(message) {
  const ul = room.querySelector('ul');
  const li = document.createElement('li');
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector('#msg input');
  const value = input.value;
  socket.emit('new_message', value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = '';
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = welcome.querySelector('#nickname input');
  socket.emit('nickname', input.value, showEnterRoom);
  nickname = input.value;
}

function showEnterRoom() {
  welcome.hidden = true;
  enter.hidden = false;
  const h3 = enter.querySelector('h3');
  h3.innerText = `Your nickname: ${nickname}`;
  const enterForm = enter.querySelector('#room-name');
  enterForm.addEventListener('submit', handleEnterRoomSubmit);
}

function handleEnterRoomSubmit(event) {
  event.preventDefault();
  const enterForm = enter.querySelector('#room-name');
  const input = enterForm.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

function showRoom() {
  enter.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector('h3');
  const h4 = room.querySelector('h4');
  h3.innerText = `Room: ${roomName}`;
  h4.innerText = `I'm ${nickname}`;
  const msgForm = room.querySelector('#msg');
  msgForm.addEventListener('submit', handleMessageSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const msgForm = room.querySelector('#msg');
  const input = msgForm.querySelector('input');
  socket.emit('enter_room', input.value, showRoom);
  roomName = input.value;
  input.value = '';
}

nicknameForm.addEventListener('submit', handleNicknameSubmit);

socket.on('welcome', (user, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} arrived!`);
});

socket.on('bye', (left, newCount) => {
  const h3 = room.querySelector('h3');
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left :(`);
});

socket.on('new_message', addMessage);

socket.on('room_change', (rooms) => {
  const roomList = enter.querySelector('ul');
  roomList.innerHTML = '';
  if (rooms.length === 0) {
    return;
  }

  rooms.forEach((room) => {
    const li = document.createElement('li');
    li.innerText = room;
    roomList.append(li);
  });
});
