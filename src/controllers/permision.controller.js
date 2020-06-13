const Permision = require('../models/permision.model')
const Notification = require('../models/notification.model');
const OauthUser = require('../models/oauth2User.model')

const permisionController = {}

permisionController.get_permisions = async (req, res, next) => {
    await Permision.find().populate('withPermisions').populate('document').then(function (permision) {
            res.status(200).send(permision)
        })
        .catch(err => res.status(400).json(err))


};

permisionController.getPermisionsByDocument = async (req, res, next) => {
    const params = JSON.parse(JSON.stringify(req.params));
    
    await Permision.find({document: params.id }).populate('withPermisions').populate('document').then(function (permision) {
            res.status(200).send(permision)
        })
        .catch(err => res.status(400).json(err))


};

permisionController.post_permision = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));
    
        for (let i = 0; i < body.name.length; i++) {             
            await OauthUser.findOne({name: body.name[i]}).then( user => {         
            permision_body = {
                withPermisions: user._id,
                document: body.document,
            }
            Permision.findOne({withPermisions: user._id, document: body.document}).then( permision => {
                if (permision) {
                    res.status(400).json({message: `El usuario ${user.name} ya tiene permisos sobe el documento`}) ;
                }else{
                    Permision.create(permision_body).then(newPpermision => {
                        Permision.findOne({
                            withPermisions: newPpermision.withPermisions
                        }).populate('document').then(perm => {
                            notification_body = {
                                notification: `Un usuario desea compartirte`,
                                forPermisions: newPpermision.withPermisions,
                                document: newPpermision.document
                            };
                            Notification.create(notification_body);
                        })
                        res.status(200).send(permision)
                    })
                    .catch(err => res.status(400).json(err))
                }        
            })
        })
        }
};

permisionController.delete_permision = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Permision.findOneAndRemove({
            _id: params.id
        }).then(permision => {
            Notification.findOneAndRemove({
                forPermisions: permision.withPermisions
            }).then(
                res.status(200).send(permision)
            )
        })
        .catch(err => res.status(400).json(err))
}

permisionController.cancelPermisionShared = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Permision.findOneAndRemove({
        document: params.id,
        withPermisions: req.user._id
    }).then( permision => {
        res.status(200).send(permision)
    })
}

module.exports = permisionController;