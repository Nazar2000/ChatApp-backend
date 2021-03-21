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
router.get('/contacts-list', async function (req, res) {
    try {
        let {id} = req.body;
        const sql = `SELECT * FROM users_contact_list WHERE id = id`
        con.query(
            sql, [id],
            function (err, result) {
                if (err) {
                    res.send({status: 0, data: err});
                } else {
                    const data = {
                        id: result[0].id,
                        contacts: JSON.parse(result[0].contacts),
                    }
                    res.send({data: data});
                }
            })
    } catch (error) {
        res.send({status: 0, error: error});
    }
});
router.post('/contacts', async function (req, res) {
    try {
        let userId = req.body.id;
        let contacts = [{
            displayName: req.body.username,
            telNumber: req.body.telNumber
        }];
        const checkId = `SELECT * FROM users_contact_list WHERE +userId = ?`;
        con.query(checkId, [userId], (err, result) => {
            if (result) {
                if (result.length) {
                    const sql = `UPDATE users_contact_list SET contacts = ? WHERE +userId = ?`;
                    const resultContacts = JSON.parse(result[0].contacts)
                    if (+resultContacts[0].telNumber !== +contacts[0].telNumber) {
                        const contactsArr = JSON.stringify(resultContacts.concat(contacts));
                        con.query(
                            sql, [contactsArr, userId],
                            (err, result) => {
                                if (err) {
                                    res.send({status: 0, data: err});
                                } else {
                                    res.send({data: result});
                                }
                            })
                    } else {
                        res.send({status: 0, data: 'err'});
                    }
                } else {
                    const sql = `Insert Into users_contact_list(userId, contacts) VALUES (?, ?)`
                    con.query(
                        sql, [userId, contacts],
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
