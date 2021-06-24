const {router} = require('./../variables/variables.js');
const {con} = require('./../variables/variables.js');
const {jwt} = require('./../variables/variables.js');
const {md5} = require('./../variables/variables.js');

router.post('/register', async function (req, res) {
    try {
        let {username, telNumber, password} = req.body;
        const hashed_password = md5(password.toString())
        const checkPhone = `Select telNumber FROM users WHERE telNumber = ?`;
        con.query(checkPhone, [telNumber], (err, result) => {
            if (result == null || result[0] == null) {
                const sql = `Insert Into users (username, telNumber, password) VALUES ( ?, ?, ? )`
                con.query(
                    sql, [username, telNumber, hashed_password],
                    (err) => {
                        if (err) {
                            res.sendStatus( 400);
                        } else {
                            res.send({status: 200, message: 'Successfully created!'});
                        }
                    })
            } else if (result[0].telNumber === telNumber) {
                res.send({status: 400, message: 'The number is already registered'});
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
                console.log(result);
                if (err) {
                    res.send({status: 0, data: err});
                } else {
                    if (result.length) {
                        const data = {
                            username: result[0].username,
                            telNumber: result[0].telNumber,
                            id: result[0].id
                        }
                        let token = jwt.sign({data: data}, process.env.TOKEN_SECRET, {expiresIn: '1800s'})
                        res.send({token: token});
                    } else {
                        res.send({status: 400, data: err});
                    }
                }
            })
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
module.exports = router;
