const socket = io();

let username = prompt("Your name?");
socket.emit("join", username);

const codeEl = document.getElementById("code");
const output = document.getElementById("output");
const messages = document.getElementById("messages");
const usersEl = document.getElementById("users");

// сохранение
codeEl.value = localStorage.getItem("code") || "";
codeEl.oninput = () => {
    localStorage.setItem("code", codeEl.value);
};

// запуск
function run() {
    socket.emit("run_code", codeEl.value);
}

function clearOutput() {
    output.innerText = "";
}

socket.on("output", (data) => {
    output.innerText += data + "\n";
});

// чат
document.getElementById("msgInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        socket.emit("chat", e.target.value);
        e.target.value = "";
    }
});

socket.on("chat", (data) => {
    messages.innerHTML += `<div><b>${data.user}:</b> ${data.message}</div>`;
});

// онлайн
socket.on("online", (list) => {
    usersEl.innerHTML = "";
    list.forEach(u => {
        usersEl.innerHTML += `<li>${u}</li>`;
    });
});