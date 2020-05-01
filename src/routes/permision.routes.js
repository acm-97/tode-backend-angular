const { Router } = require('express');
const router = Router();
const { get_permisions, getPermisionsByDocument , post_permision, delete_permision, cancelPermisionShared } = require('../controllers/permision.controller')

const oauth2 = require('../middlewares/oauth2')

router.route('/api/permisions').get(get_permisions);

router.route('/api/getPermisionsByDocument/:id').get(getPermisionsByDocument);

router.route('/api/new_permision').post(post_permision);

router.route('/api/delete_permision/:id').delete(delete_permision);

router.route('/api/cancelPermisionShared/:id').delete(cancelPermisionShared);


module.exports = router;