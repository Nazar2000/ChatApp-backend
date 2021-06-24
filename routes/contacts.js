const {router} = require('./../variables/variables.js');
const {con} = require('./../variables/variables.js');
const {authenticateToken} = require('./../variables/variables.js');

function checkContactInList(res, userId, displayName, telNumber) {
    const checkId = `SELECT * FROM users_contact_list WHERE +userId = ?`;
    let message;
    con.query(checkId, [userId], (err, result) => {
        if (result) {
            if (result.length) {
                const sql = `UPDATE users_contact_list SET displayName = ?, telNumber = ? WHERE +userId = ?`;
                con.query(sql, [displayName, telNumber, userId], function (err, result) {
                    if (result) {
                        message = {status: 200, message: 'Contact added!'};
                    }
                })
            } else {
                const sql = `Insert Into users_contact_list(userId, displayName,telNumber) VALUES (?, ?, ?)`
                con.query(sql, [userId, displayName, telNumber], function (err, result) {
                    if (result) {
                        message = {status: 200, message: 'Contact added!'};
                    }
                })
            }
        }
    });
    return {status: 200, message: 'Contact added!'};
}

router.get('/contact-check/:telNumber', authenticateToken, async function (req, res) {
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
router.post('/contact-checks', authenticateToken, async function (req, res) {
    try {
        const {id, telNumbersArray} = req.body;
        let contactExist = false;
        let contactAdded = false;
        telNumbersArray.forEach((item, index) => {
            let telNumber = item.phoneNumbers[0].number
            telNumber = telNumber.replace(/\+/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/\s+/g, '');
            if (telNumber.length > 10) {
                telNumber = telNumber.substr(telNumber.length - 10, telNumber.length);
            }
            const sql = `SELECT * FROM users WHERE +telNumber = ?`
            con.query(
                sql, [telNumber],
                function (err, result) {
                    if (result[0]) {
                        contactExist = true;
                        let displayName = result[0].username;
                        let resultTelNumber = result[0].telNumber;
                        const response = checkContactInList(res, id, displayName, resultTelNumber);
                        if (response) {
                            contactAdded = true;
                        }
                    }
                    if (contactAdded && index === telNumbersArray.length - 1) {
                        res.send({status: 200, message: 'Contact added!', color: 'success'})
                    }
                    if (!contactExist && index === telNumbersArray.length - 1) {
                        res.send({status: 200, messages: 'No matches found', color: 'warning'})
                    }
                })
        })

    } catch (error) {
        res.send({status: 0, error: error});
    }
});
router.get('/contacts-list/:id', authenticateToken, async function (req, res) {
    try {
        let id = req.params.id;
        const sql = `SELECT *, GROUP_CONCAT(+userId) FROM users_contact_list GROUP BY +userId`
        con.query(
            sql, [id],
            function (err, result) {
                if (err) {
                    res.send({status: 0, data: err});
                } else {
                    if (result.length) {
                        let contacts = [];
                        result.forEach((item) => {
                            if (item.userId === id) {
                                contacts.push({
                                    telNumber: item.telNumber,
                                    displayName: item.displayName
                                });
                            }
                        })
                        if (contacts.length) {
                            const data = {
                                id: result[0].id,
                                contacts,
                            }
                            res.send({data: data});
                        } else {
                            res.send();
                        }
                    } else {
                        res.send();
                    }
                }
            })
    } catch (error) {
        res.send({status: 0, error: error});
    }
});

router.post('/contacts', authenticateToken, async function (req, res) {
    try {
        let userId = req.body.id;
        let displayName = req.body.username;
        let telNumber = req.body.telNumber;
        checkContactInList(res, userId, displayName, telNumber);
    } catch (error) {
        res.send({status: 400, error: error});
    }
});
module.exports = router;
