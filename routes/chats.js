const {router} = require('./../variables/variables.js');
const {con} = require('./../variables/variables.js');
const {io} = require('./../variables/variables.js');

var usernames = {};

var rooms = ['Lobby'];

io.sockets.on('connection', function (socket) {
    socket.on('adduser', function (data) {
        socket.username = data.username;
        socket.room = 'Lobby';
        usernames[data.username] = data.username;
        socket.join('Lobby');
        let userId = data.id;
        let recipientNumber = data.recipientNumber;
        const sqlSelect = `SELECT id FROM users WHERE +telNumber = ?`;
        con.query(sqlSelect, [recipientNumber], (err, result) => {
            if (result) {
                const recipientId = result[0].id
                if (result.length) {
                    const sqlT = 'SELECT *, GROUP_CONCAT(userId) FROM chat_messages GROUP BY message '
                    con.query(sqlT, [userId, recipientId], (err, result) => {
                        if (result) {
                            result.forEach((item) => {
                                socket.emit('updateChat',  item.userId, item.message);
                            })
                        }
                    })
                }
            }
        });
        socket.emit('updateRooms', rooms, 'Lobby');
    });

    socket.on('create', function (room) {
        rooms.push(room);
        socket.emit('updateRooms', rooms, socket.room);
    });

    socket.on('sendChat', function (data) {
        let userId = data.id;
        let recipientNumber = data.recipientNumber;
        let message = data.message;
        let timestamp = data.timestamp;
        const sqlSelect = `SELECT id FROM users WHERE +telNumber = ?`;
        con.query(sqlSelect, [recipientNumber], (err, result) => {
            if (result) {
                if (result.length) {
                    const sql = `Insert Into chat_messages(userId, recipientId, message, timestamp) VALUES (?, ?, ?, ?)`
                    con.query(sql, [userId, result[0].id, message, timestamp])
                }
            }
        });
        io.sockets["in"](socket.room).emit('updateChat', userId, data);
    });

    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.leave(socket.room);
    });
});


module.exports = router;
