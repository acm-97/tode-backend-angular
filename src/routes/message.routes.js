const { Router } = require('express');
const router = Router();
const { get_message, post_message } = require('../controllers/message.controller')

router.route('/api/message/:id').get(get_message);

router.route('/api/message').post(post_message);




module.exports = router;