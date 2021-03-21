const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');

const md5 = require('md5');
const cors = require('cors');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "ChatApp",
});
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:8100",
        credentials: true
    }
});


module.exports = {
    express,
    jwt,
    router,
    mysql,
    con,
    http,
    app,
    io,
    cors,
    md5
}
