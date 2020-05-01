const Oauth2User = require("../models/oauth2User.model");

auth = async (req, res, next) => {
    const token = req.header('Autorizacion')
    const sceibaId = req.header('sceibaId')
    //Chequear q existe un token(user) 
    try {
        await Oauth2User.findOne({
                sceibaId: sceibaId
            }).then(function (user) {
                let date = new Date();
                if (user && user.expires_in > date.getTime()) {
                    if (token && user.access_token === token) {
                        return req.user = user
                    }
                } else {

                    return res.status(401).json({
                        message: 'Tiempo de sesion agotado. Vuelva a loguearse'
                    });
                }
            })
            .catch(err => res.status(400).json(err))
    } catch (e) {
        res.status(400).json({
            access_token: 'Usuario invalido'
        })
    }

    next()
}
module.exports = auth;