const User = require('../models/user.model');
const Permision = require('../models/permision.model')
const Oauth2User = require("../models/oauth2User.model");

const userController = {};

userController.get_users = async (req, res, next) => {
    await User.find().then(function (user) {
        res.status(200).send(user)
    })
    .catch(err => res.status(400).json(err))
}

userController.get_user = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Oauth2User.findOne({
        sceibaId: params.id
    }).then(function (user) {
        res.status(200).send(user)
    })
    .catch(err => res.status(400).json(err))
}

userController.getUsersToPermission = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    const regex = new RegExp(query.value)
    
    await Oauth2User.find({
        name: {$regex: regex, $options: 'i'}
    }).then( users => {  
        permisions.forEach( perm => {
            users.forEach( user => {
                if (perm && user._id.toString() != perm.withPermisions.toString()) {  
                    //names[index] = user.name              
                    names.push(user.name)
                }
            })     
        }) 
        res.status(200).json(names)
     })
    .catch(err => res.status(400).json(err))
};

userController.updateUser = async (req, res, next) =>{
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Oauth2User.updateOne({
        _id: body.id
    }, {
        $set: {
        name: body.name,
        role: body.role.toString()
        }
    });
}

userController.updateImage = async (req, res) => {   
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await Oauth2User.updateOne({
        _id: body.id
    }, {
        $set: {
        perfilImage: `${config.images_dir}/${file.filename}`
        }
    });
}

userController.delete_user = async (req, res, next) => {
    const body = JSON.parse(JSON.stringify(req.body));
    const params = JSON.parse(JSON.stringify(req.params));
    const query = JSON.parse(JSON.stringify(req.query));

    await User.findOneAndRemove({
        _id: params.id
    }).then(function (user) {
        res.status(200).send(user)
    })
    .catch(err => res.status(400).json(err))
}


module.exports = userController;