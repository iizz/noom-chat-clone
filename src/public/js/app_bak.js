const messageList = document.querySelector('ul');
const nickForm = document.querySelector('#nick');
const messageForm = document.querySelector('#message');
const socket = new WebSocket(`ws://${window.location.host}`);

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

socket.addEventListener('open', () => {
  console.log('Connected to the server ✅');
});

socket.addEventListener('message', (message) => {
  const li = document.createElement('li');
  li.innerText = message.data;
  messageList.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.addEventListener('close', () => {
  console.log('Disconnected from the server ❌');
});

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector('input');
  socket.send(makeMessage('nickname', input.value));
}

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector('input');
  socket.send(makeMessage('new_message', input.value));
  const li = document.createElement('li');
  li.innerText = `You: ${input.value}`;
  messageList.appendChild(li);
  window.scrollTo(0, document.body.scrollHeight);
  input.value = '';
}

nickForm.addEventListener('submit', handleNickSubmit);
messageForm.addEventListener('submit', handleSubmit);
