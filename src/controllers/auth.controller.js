const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken')
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";
const passport = require("passport")

const userController = {};



userController.post_user_auth = async (req, res, next) => {
    /*await User.create(req.body).then(function (user) {
        res.send(user);
    })*/

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "LLene todos los campos" })
    }

    User.findOne({ email }).then(user => {
        if (!user) return res.status(400).json({ msg: "El usuario no existe" })

        //Create salt & hash    
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: "Credenciales invalidas" });

            jwt.sign(
                {
                    id: user.id,
                    rol: user.rol
                 },
                config.get('jwtSecret'),
                (err, token) => {
                    if (err) throw err;
                    res.json({
                        token,
                        user: user
                    });
                })
        })
        
    });


};


userController.get_user_auth = (req, res) => {
    User.findById(req.user.id).select('-password').then(user =>
        res.status(200).send(JSON.stringify(user)))
};

//autenticacion con oauth2
userController.getUserOauth2 = () => {
    console.log('jajajajajj');
    
    // passport.authenticate("oauth2");
}

// redirect to home page after successfully login via oauth2
userController.redirect = () => {
  passport.authenticate("oauth2", {
    successRedirect: CLIENT_HOME_PAGE_URL,
    failureRedirect: "http://localhost:3000"
  })
};

module.exports = userController; 