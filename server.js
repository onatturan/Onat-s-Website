const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// HTML dosyasını sunma
app.use(express.static('public'));  // HTML dosyasının olduğu klasörü belirtin

// Socket.io ile iletişim kurma
io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("chat message", (msg) => {
        io.emit("chat message", msg);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// Sunucuyu başlatma
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
