const {router} = require('./../variables/variables.js');
var contacts = require('./contacts');
router.use('/contacts', contacts);
module.exports = router;
