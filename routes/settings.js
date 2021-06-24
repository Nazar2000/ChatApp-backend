const {authenticateToken} = require('./../variables/variables.js');
const {router} = require('./../variables/variables.js');
const {con} = require('./../variables/variables.js');

router.post('/change-name', authenticateToken, async function (req, res) {
    try {
        let userId = req.body.id;
        let displayName = req.body.username;
        const sql = `UPDATE users SET username = ? WHERE +id = ?`;
        con.query(sql, [displayName, userId], function (err, result) {
            if (result) {
                res.send({username: displayName});
            }
        })
    } catch (error) {
        res.send({status: 400, error: error});
    }
});
module.exports = router;
