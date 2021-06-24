const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const app = express();
const http = require('http').createServer(app);
const mysql = require('mysql');

const md5 = require('md5');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "ChatApp",
});
// const con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "password",
//     database: "chatapp",
// });
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        credentials: true
    }
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = {
    express,
    jwt,
    router,
    mysql,
    con,
    http,
    app,
    io,
    dotenv,
    cors,
    md5,
    authenticateToken
}

