const {router} = require('./../variables/variables.js');
const {con} = require('./../variables/variables.js');
const {io} = require('./../variables/variables.js');
//
// let notes = []
// let socketCount = 0
// let userId;
// let recipientId;
// let roomId;
// var usersIdSocket = [];
//
// function getSocketId(id) {
//     return usersIdSocket.filter(item => {
//         if (item.id === id) {
//             return item.socketId
//         }
//     })
// }
//
// function initFunction(socket) {
//     const sql = 'SELECT * FROM chat_messages WHERE +userId = ? OR +recipientId = ?'
//     con.query(sql, [userId, recipientId], (err, result) => {
//             if (result.length) {
//                 if (result[0].messages[0] != null) {
//                     result[0].messages = JSON.parse(result[0].messages);
//                     socket.emit('initial notes', [result[0]])
//                 }
//             } else {
//                 const messages = JSON.stringify([]);
//                 const sql = `Insert Into chat_messages(userId, recipientId, messages) VALUES (?, ?, ?)`
//                 con.query(sql, [userId, recipientId, messages])
//             }
//         }
//     )
// }
//
// io.sockets.on('connection', function (socket) {
//     // Socket has connected, increase socket count
//     socketCount++
//     // Let all sockets know how many are connected
//     io.sockets.emit('users connected', socketCount)
//
//     socket.on('unsubscribe', function (room) {
//         socket.leave(room);
//     })
//
//     socket.on('disconnect', function () {
//         // Decrease the socket count on a disconnect, emit
//         socketCount--
//         io.sockets.emit('users connected', socketCount)
//     })
//
//     socket.on('init', function (data) {
//         userId = data.id;
//         usersIdSocket.push({id: userId, socketId: socket.id})
//         const telNumber = data.recipientNumber;
//         notes = [];
//             const sql = 'SELECT id FROM users WHERE telNumber = ?'
//             con.query(sql, [telNumber], (err, result) => {
//                     if (result.length) {
//                         recipientId = result[0].id
//                         initFunction(socket);
//                     }
//                 }
//             )
//
//         if (!roomId) {
//             const sql = 'SELECT id FROM chat_messages WHERE +userId = ?'
//             con.query(sql, [userId], (err, result) => {
//                     if (result.length) {
//                         roomId = result[0].id;
//                         socket.join(roomId);
//                         socket.emit('updateChat', 'SERVER', 'you have connected to Lobby');
//                         socket.broadcast.to('Lobby').emit('updateChat', 'SERVER', 'username' + ' has connected to this room');
//                         socket.emit('updateRooms', rooms, 'Lobby');
//                     }
//                 }
//             )
//         }
//     })
//     io.on('new note', function (data) {
//         console.log(data);
//     })
//     socket.on('message', function (data) {
//         // New note added, push to all sockets and insert into con
//         let userId = data.id;
//         let messages = [data.message];
//         const newMessage = {
//             id: roomId,
//             messages: data.message,
//             recipientId: recipientId,
//             userId: userId
//         }
//         const socketId = getSocketId(recipientId)[0].socketId;
//         console.log(socketId, roomId,recipientId);
//         // socket.emit('new note', newMessage)
//         io.to(socketId).emit('new note', newMessage);
//
//         // socket.to(socketId).emit('new note', [newMessage]);
//         // Use node's con injection format to filter incoming data
//         const sql = `SELECT * FROM chat_messages WHERE +userId = ? OR +recipientId = ?`;
//         con.query(sql, [userId, userId], (err, result) => {
//             if (result) {
//                 if (result.length) {
//                     const sql = `UPDATE chat_messages SET messages = ? WHERE +userId = ? OR +recipientId = ?`;
//                     const resultMessages = JSON.parse(result[0].messages)
//                     const contactsArr = JSON.stringify(resultMessages.concat(messages));
//                     con.query(sql, [contactsArr, userId, userId])
//                 }
//             }
//         });
//     })
// })
//
//
// router.get('/chats/:id', async function (req, res) {
//     try {
//         let id = +req.params.id;
//         const sql = `SELECT * FROM chats_list WHERE +userId = ?`
//         con.query(
//             sql, [id],
//             function (err, result) {
//                 if (err) {
//                     res.send({status: 0, data: err});
//                 } else {
//                     const data = {
//                         id: result[0].id,
//                         chats: JSON.parse(result[0].chats),
//                     }
//                     res.send({data: data});
//                 }
//             })
//     } catch (error) {
//         res.send({status: 0, error: error});
//     }
// });
// router.post('/chats/', async function (req, res) {
//     try {
//         let {telNumber, userId} = req.body;
//         let chats = [telNumber];
//         const sql = `SELECT * FROM chats_list WHERE +userId = ?`
//         con.query(
//             sql, [telNumber],
//             function (err, result) {
//                 if (result) {
//                     if (result.length) {
//                         const sql = `UPDATE chats_list SET chats = ? WHERE +userId = ?`;
//                         const resultChats = JSON.parse(result[0].chats)
//                         if (+resultChats[0].indexOf(telNumber)) {
//                             const chatsArr = JSON.stringify(resultChats.concat(chats));
//                             con.query(
//                                 sql, [chatsArr, userId],
//                                 (err, result) => {
//                                     if (err) {
//                                         res.send({status: 0, data: err});
//                                     } else {
//                                         res.send({data: result});
//                                     }
//                                 })
//                         } else {
//                             res.send({status: 0, data: 'err'});
//                         }
//                     } else {
//                         const sql = `Insert Into chats_list(userId, chats) VALUES (?, ?)`
//                         chats = JSON.stringify(chats);
//                         con.query(
//                             sql, [usersId, chats],
//                             (err, result) => {
//                                 if (err) {
//                                     res.send({status: 0, data: err});
//                                 } else {
//                                     res.send({data: result});
//                                 }
//                             })
//                     }
//                 }
//             })
//     } catch (error) {
//         res.send({status: 0, error: error});
//     }
// });

var usernames = {};

var rooms = ['Lobby'];

io.sockets.on('connection', function(socket) {
    socket.on('adduser', function(username) {
        socket.username = username;
        socket.room = 'Lobby';
        usernames[username] = username;
        socket.join('Lobby');
        // socket.emit('updateChat', 'SERVER', 'you have connected to Lobby');
        // socket.broadcast.to('Lobby').emit('updateChat', 'SERVER', username + ' has connected to this room');
        socket.emit('updateRooms', rooms, 'Lobby');
    });

    socket.on('create', function(room) {
        rooms.push(room);
        socket.emit('updateRooms', rooms, socket.room);
    });

    socket.on('sendChat', function(data) {
        io.sockets["in"](socket.room).emit('updateChat', socket.username, data);
    });

    // socket.on('switchRoom', function(newroom) {
    //     var oldroom;
    //     oldroom = socket.room;
    //     socket.leave(socket.room);
    //     socket.join(newroom);
    //     socket.emit('updateChat', 'SERVER', 'you have connected to ' + newroom);
    //     socket.broadcast.to(oldroom).emit('updateChat', 'SERVER', socket.username + ' has left this room');
    //     socket.room = newroom;
    //     socket.broadcast.to(newroom).emit('updateChat', 'SERVER', socket.username + ' has joined this room');
    //     socket.emit('updateRooms', rooms, newroom);
    // });

    socket.on('disconnect', function() {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        // socket.broadcast.emit('updateChat', 'SERVER', socket.username + ' has disconnected');
        socket.leave(socket.room);
    });
});




module.exports = router;
