const { Router } = require('express');
const router = Router();
const { get_message, post_message } = require('../controllers/message.controller')

const auth = require('../middlewares/auth')

router.route('/message').get(get_message);

router.route('/message').post(post_message);




module.exports = router;