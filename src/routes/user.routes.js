const { Router } = require('express');
const router = Router();
var multer = require('multer');
var config = require('config');
var uuidv4 = require('uuid/v4');

const { get_users, get_user, getUsersToPermission, updateUser, updateImage, delete_user } = require('../controllers/user.controller')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.images_dir);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    //limits:{fileSize: 2000000},
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
}).single('image')

const oauth2 = require('../middlewares/oauth2')

router.route('/api/user').get(oauth2, get_users);

router.route('/api/user/:id').get(get_user);

router.route('/api/user_topermision').get(oauth2, getUsersToPermission);

router.route('/api/updateUser').post(updateUser);

router.route('/api/updateImage').post(upload, updateImage);

router.route('/api/delete_user/:id').delete(oauth2, delete_user);


module.exports = router;