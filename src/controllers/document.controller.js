const Document = require('../models/document.model');
const Permision = require('../models/permision.model')
const DocumentVersion = require('../models/document_version.model');
const {
    crearDirectorio
} = require('./versionContent.controller')
const validateDocuments = require('../validation/documents')
// var fs = require('fs');
// var config = require('config')

const documentController = {};

documentController.get_documents = async (req, res, next) => {
    const user = JSON.parse(JSON.stringify(req.user));
    var docs, perms, permsShared

    await Document.find().populate('autor').then(function (document) {
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
    res.status(200).json({
        docs: docs,
        perms: perms,
        permsShared: permsShared
    })
};

documentController.get_document = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Document.findOne({
            _id: params.id
        }).populate('autor').then(function (document) {
            res.status(200).send(document)
        })
        .catch(err => res.status(400).json(err))
};

documentController.document_ByName = async (req, res, next) => {    
    const body = JSON.parse(JSON.stringify(req.body))
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query))
    
    await Document.findOne({
            name: params.name
        }).populate('autor').then(document =>
            res.status(200).send(document)
        )
        .catch(err => res.status(400).json(err))
};

documentController.post_document = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));DocumentVersion
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    const {
        errors,
        isValid
    } = validateDocuments(body)

    if (!isValid) {
        return res.status(400).json(errors)
    }
        Document.create(body).then(document => {
            crearDirectorio(document);
            permision_body = {
                requestAcepted: true,
                withPermisions: document.autor,
                document: document
            }
            Permision.create(permision_body)
            res.status(200).send(document)
        })
    .catch(err => res.status(400).json(err))
};

/* documentController.put_document = async (req, res, next) => {
    await Document.findOneAndUpdate({
            _id: req.params.id
        }, req.body).then(function () {
            Document.findOne({
                _id: req.params.id
            }).then(function (document) {
                res.status(200).send(document)
            });
        })
        .catch(err => res.status(400).json(err))
} */

documentController.delete_document = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));;
    const params = JSON.parse(JSON.stringify(req.params));;
    const query = JSON.parse(JSON.stringify(req.query));;

    await Document.findOneAndRemove({
            _id: params.id
        }).then(function (document) {
            Permision.findOneAndRemove({
                document: params.id
            }).then(function (permision) {
                res.status(200).send(document)
            })
        })
        .catch(err => res.status(400).json(err))
}

documentController.updateDocumentName = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Document.updateOne({
            _id: query.id,
        }, {
            name: query.name
        })
        .then(notification =>
            res.status(200).json(notification)
        )
        .catch(err => res.status(400).json(err))

}

module.exports = documentController;