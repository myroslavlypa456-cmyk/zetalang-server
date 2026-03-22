const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let users = [];

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("join", (name) => {
    users.push({ id: socket.id, name });
    io.emit("users", users);
  });

  socket.on("message", (msg) => {
    io.emit("message", msg);
  });

  socket.on("disconnect", () => {
    users = users.filter(u => u.id !== socket.id);
    io.emit("users", users);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server started"));