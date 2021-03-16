var express = require('express');
var router = express.Router();
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "ChatApp",
});
router.post('/register', async function (req, res, next) {
    try {
        let {username, telNumber, password} = req.body;
        const hashed_password = md5(password.toString())
        const checkUsername = `Select username FROM users WHERE username = ?`;
        con.query(checkUsername, [username], (err, result) => {
            if (!result.length) {
                const sql = `Insert Into users (username, telNumber, password) VALUES ( ?, ?, ? )`
                con.query(
                    sql, [username, telNumber, hashed_password],
                    (err, result) => {
                        if (err) {
                            res.send({status: 0, data: err});
                        } else {
                            let token = jwt.sign({data: result}, 'secret')
                            res.send({status: 1, data: result, token: token});
                        }
                    })
            }
        });
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
router.post('/login', async function (req, res, next) {
    try {
        let {telNumber, password} = req.body;
        const hashed_password = md5(password.toString())
        const sql = `SELECT * FROM users WHERE telNumber = ? AND password = ?`
        con.query(
            sql, [telNumber, hashed_password],
            function (err, result) {
                if (err) {
                    res.send({status: 0, data: err});
                } else {
                    let token = jwt.sign({data: result}, 'secret')
                    res.send({status: 1, data: result, token: token});
                }
            })
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
module.exports = router;
