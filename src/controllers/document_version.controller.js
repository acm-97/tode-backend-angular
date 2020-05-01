const DocumentVersion = require('../models/document_version.model');
const Document = require('../models/document.model');
const Notification = require('../models/notification.model');
const Permision = require('../models/permision.model');
const {
    createVersionFile
} = require('./versionContent.controller')
var config = require('config')

const document_versionController = {};

document_versionController.get_documents_version = async (req, res, next) => {
    const user = JSON.parse(JSON.stringify(req.user));
    var docs, perms, permsShared, docs_version, versiones, last, lastShared

    await Document.find().populate('autor').populate('editor').then(function (document) {
        docs = document;
    })

    await Permision.find().populate('withPermisions').populate('document').then(function (permision) {
        // perm = permision
        perms = new Array(permision.length);
        permsShared = new Array(permision.length)

        docs.forEach(doc => {
            permision.forEach((perm, index) => {                
                if (user && user._id.toString() == perm.withPermisions._id.toString() && user._id.toString() == perm.document.autor.toString()) {
                    perms[index] = perm;
                }
                if (user && user._id.toString() == perm.withPermisions._id.toString() && user._id.toString() !== perm.document.autor.toString() && perm.requestAcepted == true && perm.document._id.toString() == doc._id.toString()) {
                    permsShared[index] = perm
                }
            });
        });
    });

    await DocumentVersion.find().populate('autor').populate('editor').populate('document').then((document_version) => {
        docs_version = document_version 

        last = new Array(perms.length);
            perms.forEach((perm, perm_index) => {
                versiones = new Array();
                document_version.forEach((vers, vers_index) => {                    
                    if (perm.document._id.toString() == vers.document._id.toString()) {
                        versiones[vers_index] = vers;
                    }
                })
                last[perm_index] = versiones[versiones.length - 1];
            })

            lastShared = new Array(permsShared.length);
                permsShared.forEach((perm, perm_index) => {
                    versiones = new Array();
                    document_version.forEach((vers, vers_index) => {                        
                        if (perm.document._id.toString() == vers.document._id.toString()) {
                            versiones[vers_index] = vers;
                        }
                    })
                    lastShared[perm_index] = versiones[versiones.length - 1];
                })                
        })                   
        res.status(200).json({
            docs_version: docs_version,
            last: last,
            lastShared: lastShared
        })
};

document_versionController.getVersionsById = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));
    
    await DocumentVersion.find({
            document: params.id
        }).populate('autor').populate('editor').populate('document').then(function (document_version) {
            res.status(200).json(document_version)
        })
        .catch(err => res.status(400).json(err));
};

document_versionController.get_document_version = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));
    
    await DocumentVersion.findOne({
            _id: params.id
        }).populate('autor').populate('editor').populate('document').then(function (document_version) {
            res.status(200).json(document_version)
        })
        .catch(err => res.status(400).json(err));
};

document_versionController.post_document_version = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));
    
    let images = new Array()
    req.files.forEach((files, index) =>
        images[index] = `${config.images_dir}/${files.filename}`
    )

    version_body = {
        coment: body.coment,
        autor: body.autor,        
        editor: body.autor,
        document: body.document,
        images: images
    }
    
    await DocumentVersion.create(version_body).then(document_version => {
            createVersionFile(document_version, body.text)
            res.status(200).json(document_version)
        })
        .catch(err => res.status(400).json(err));
};

document_versionController.put_document_version = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));    

    let images = new Array()
    req.files.forEach((files, index) =>
        images[index] = `${config.images_dir}/${files.filename}`
    )

    version_body = {
        coment: body.coment,
        autor: body.autor,        
        editor: body.editor,
        document: body.document,
        images: images
    }
    await DocumentVersion.create(version_body).then(document_version => {
        createVersionFile(document_version, body.text)
        Permision.find({
                document: document_version.document
            }).populate('document').then(permision => {
                permision.forEach((perm) => {
                    if (perm.withPermisions.toString() != document_version.editor.toString()) {
                        notification_body = {
                            notification: `Nueva versión creada`,
                            toUser: perm.withPermisions,
                            document: perm.document._id,
                            document_version: document_version._id
                        }
                        Notification.create(notification_body)
                    }
                })
                res.status(200).json(document_version)
            })
            .catch(err => res.status(400).json(err));
    })
}

document_versionController.delete_document_version = async (req, res, next) => {
    const params = JSON.parse(JSON.stringify(req.params)) ;

    await DocumentVersion.findOneAndRemove({ document: params.id }).then((document_version) => {
        Document.findOneAndRemove({ _id: document_version.document }).then();
        Permision.findOneAndRemove({ document: document_version.document }).then();
        res.send(document_version);
    });
}


module.exports = document_versionController;