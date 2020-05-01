const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const Oauth2User = require("../models/oauth2User.model");
const config = require('config');

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(new OAuth2Strategy({
    authorizationURL: config.get("authorizationURL"),
    tokenURL: config.get("tokenURL"),
    clientID: config.get("clientID"),
    clientSecret: config.get("clientSecret"),
    callbackURL: config.get("callbackURL")
  },
  async (token, tokenSecret, profile, params, done) => {
    // find current user in Oauth2UserModel
    const currentUser = await Oauth2User.findOne({
      sceibaId: profile.user.id
    });
    // create new user if the database doesn't have this user
    const date = new Date();
    const expires = (parseInt(profile.expires_in) * 1000) + date.getTime();
    const str = profile.user.email;
    const name = str.split('@');

    if (!currentUser && currentUser.name != name[0]) {
      await new Oauth2User({
        access_token: profile.access_token,
        expires_in: expires,
        sceibaId: profile.user.id,
        name: name[0],
        email: profile.user.email,
        role: [],
        perfilImage:`${config.images_dir}/square-image`
      }).save();
    } else {
      await Oauth2User.updateOne({
        _id: currentUser._id
      }, {
        $set: {
          access_token: profile.access_token,
          expires_in: expires
        }
      });
    }
    done(null, profile);
  }
));

module.exports = passport;