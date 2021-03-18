const express = require('express');
const index_router = require('./routes/index');
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8100",
        credentials: true
    }
});

app.use(cors())
app.use(express.json());
app.use('/', index_router);
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('message', (msg) => {
        console.log(msg);
        socket.broadcast.emit('message-broadcast', msg);
    });
});
http.listen(3000, () => {
    console.log('listening on *:3000');
});
app.listen(4000, () => {
    console.log('listening on port 4000');
})
