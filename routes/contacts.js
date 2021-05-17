const {router} = require('./../variables/variables.js');
const {con} = require('./../variables/variables.js');

router.get('/contact-check/:telNumber', async function (req, res) {
    try {
        let telNumber = req.params.telNumber;
        const sql = `SELECT * FROM users WHERE +telNumber = ?`
        con.query(
            sql, [telNumber],
            function (err, result) {
                if (err) {
                    res.send({status: 0, data: err});
                } else {
                    res.send({data: result, message: 'Great, you can chat with him!!'});
                }
            })
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
router.get('/contacts-list/:id', async function (req, res) {
    try {
        let id = req.params.id;
        const sql = `SELECT *, GROUP_CONCAT(userId) FROM users_contact_list GROUP BY userId`
        con.query(
            sql, [id],
            function (err, result) {
                if (err) {
                    res.send({status: 0, data: err});
                } else {
                    if (result.length) {
                        let contacts = [] ;
                            result.forEach((item) => {
                            if (item.userId === id){
                                contacts.push({
                                    telNumber: item.telNumber,
                                    displayName: item.displayName
                                });
                            }
                        })
                        if (contacts.length){
                            const data = {
                                id: result[0].id,
                                contacts,
                            }
                            res.send({data: data});
                        }
                    }
                }
            })
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
router.post('/contacts', async function (req, res) {
    try {
        let userId = req.body.id;
        let displayName = req.body.username;
        let telNumber = req.body.telNumber;

        const checkId = `SELECT * FROM users_contact_list WHERE +userId = ?`;
        con.query(checkId, [userId], (err, result) => {
            if (result) {
                if (result.length) {
                    const sql = `UPDATE users_contact_list SET displayName = ?, telNumber = ? WHERE +userId = ?`;
                    con.query(
                        sql, [displayName, telNumber, userId],
                        (err, result) => {
                            if (err) {
                                res.send({status: 0, data: err});
                            } else {
                                res.send({data: result});
                            }
                        })
                } else {
                    const sql = `Insert Into users_contact_list(userId, displayName,telNumber) VALUES (?, ?, ?)`
                    con.query(
                        sql, [userId, displayName, telNumber],
                        (err, result) => {
                            if (err) {
                                res.send({status: 0, data: err});
                            } else {
                                res.send({data: result});
                            }
                        })
                }
            }
        });
    } catch (error) {
        res.send({status: 400, error: error});
    }
});
module.exports = router;
