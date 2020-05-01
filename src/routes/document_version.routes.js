const {
    Router
} = require('express');
const router = Router();
var multer = require('multer');
var config = require('config');
var uuidv4 = require('uuid/v4');

const {
    get_documents_version,
    get_document_version,
    getVersionsById,
    post_document_version,
    put_document_version,
    delete_document_version
} = require('../controllers/document_version.controller')
const {
    document_version_content
} = require('../controllers/versionContent.controller')
const oauth2 = require('../middlewares/oauth2')

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
}).array('image', 10)

router.route('/api/document_version').get(oauth2, get_documents_version);

router.route('/api/document_version/:id').get(get_document_version);

router.route('/api/getVersionsById/:id').get(getVersionsById);

router.route('/api/document_version_content/:id').get(document_version_content);

router.route('/api/new_document_version').post(upload, post_document_version);

router.route('/api/put_document_version').post(upload, put_document_version);

router.route('/api/delete_document_version/:id').delete(delete_document_version);


module.exports = router;