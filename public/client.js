const socket = io();

let name = prompt("Ник?");
socket.emit("join", name);

const chat = document.getElementById("chat");
const input = document.getElementById("msg");
const usersDiv = document.getElementById("users");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    socket.emit("message", name + ": " + input.value);
    input.value = "";
  }
});

socket.on("message", (msg) => {
  chat.innerHTML += `<div>${msg}</div>`;
  chat.scrollTop = chat.scrollHeight;
});

socket.on("users", (users) => {
  usersDiv.innerHTML = users.map(u => "🟢 " + u.name).join("<br>");
});