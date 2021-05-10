const {router} = require('./../variables/variables.js');
const contacts = require('./contacts');
const chats = require('./chats');
const auth = require('./auth');
router.use('/contacts', contacts);
router.use('/chats', chats);
router.use('/auth', auth);
module.exports = router;
