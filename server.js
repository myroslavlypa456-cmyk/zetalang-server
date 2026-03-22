const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

let users = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // вход пользователя
    socket.on("join", (username) => {
        users[socket.id] = username;
        io.emit("online", Object.values(users));
    });

    // чат
    socket.on("chat", (msg) => {
        io.emit("chat", {
            user: users[socket.id],
            message: msg
        });
    });

    // выполнение кода
    socket.on("run_code", (code) => {
        try {
            const result = require("./zetalang")(code);
            socket.emit("output", result);
        } catch (e) {
            socket.emit("output", "ERROR: " + e.message);
        }
    });

    socket.on("disconnect", () => {
        delete users[socket.id];
        io.emit("online", Object.values(users));
    });
});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});