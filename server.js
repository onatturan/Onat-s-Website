const express = require('express');
const app = express();
const SERVER_PORT = 3000;
const socketio = require('socket.io');

// Sunucu başlatma
const server = app.listen(SERVER_PORT, () => {
    console.log(`Chat Server running on http://localhost:3000/`);
});

// Statik dosyaları sunma
app.use(express.static('views'));

// Sayfaların yönlendirilmesi
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/chat.html');
});

app.get("/group", (req, res) => {
    res.sendFile(__dirname + '/views/group_chat.html');
});

// Socket.io kurulum
const io = socketio(server);

// Yeni bağlantılar
io.on('connection', (socket) => {
    console.log(`New Socket: ${socket.id}`);
    
    // Kullanıcı bağlantısı kesildiğinde
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
    
    // Mesaj alındığında
    socket.on('message', (data) => {
        console.log(`Message from ${socket.id}: ${data}`);
    });

    // Sohbet mesajı alındığında
    socket.on('chat_message', (data) => {
        data.clientId = socket.id;
        console.log(JSON.stringify(data));
        io.emit('chat_message', data);
    });

    // Grup sohbetine katılma
    socket.on('join_group', (roomName) => {
        console.log(`User ${socket.id} joined room ${roomName}`);
        socket.join(roomName);
    });

    // Grup sohbetinden çıkma
    socket.on('leave_group', (roomName) => {
        socket.leave(roomName);
    });

    // Grup mesajı gönderme
    socket.on('group_message', (data) => {
        console.log(`User ${socket.id} sent message to room ${data.group}`);
        data.senderId = socket.id;
        io.to(data.group).emit('group_message', data);
    });
});
