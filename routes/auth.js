const {router} = require('./../variables/variables.js');
const {con} = require('./../variables/variables.js');
const {jwt} = require('./../variables/variables.js');
const {md5} = require('./../variables/variables.js');

router.post('/register', async function (req, res) {
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
                            const data = {
                                username: result[0].username,
                                telNumber: result[0].telNumber,
                                id: result[0].id
                            }
                            let token = jwt.sign({data: data}, 'secret')
                            res.send({data: result, token: token});
                        }
                    })
            }
        });
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
router.post('/login', async function (req, res) {
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
                    if (result.length){
                        const data = {
                            username: result[0].username,
                            telNumber: result[0].telNumber,
                            id: result[0].id
                        }
                        let token = jwt.sign({data: data}, 'secret')
                        res.send({token: token});
                    }
                }
            })
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
module.exports = router;
