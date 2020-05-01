const { Router } = require('express');
const router = Router();
const { get_notifications, post_notification, updateNotificationDocVersion, delete_notification,
    updateNotificationForPermisions, get_notificationNumber, get_requestNumber, updateAllStatus} = require('../controllers/notification.controller')

const oauth2 = require('../middlewares/oauth2')

router.route('/api/notifications').get(oauth2, get_notifications);

router.route('/api/new_notification').post(post_notification);

router.route('/api/updateAllStatus').get(oauth2, updateAllStatus);

router.route('/api/updateNotificationDocVersion').get(oauth2, updateNotificationDocVersion);

router.route('/api/updateNotificationForPermisions/:id').get(oauth2, updateNotificationForPermisions);

router.route('/api/notificationNumber').get(oauth2, get_notificationNumber);

router.route('/api/requestNumber').get(oauth2, get_requestNumber);

router.route('/api/delete_notification/:id').delete(oauth2, delete_notification);

module.exports = router;