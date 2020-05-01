const {
  Router
} = require('express');
const router = Router();
const passport = require("../controllers/passport-setup")
const config = require('config')
const Oauth2User = require("../models/oauth2User.model");

router.get('/api/oauth2', function (req, res, next) {
  passport.authenticate("oauth2", {
    scope: 'user:email',
    successRedirect: config.get("CLIENT_HOME_PAGE_URL"),
    failureRedirect: "/api/oauth2"
  }, async function (err, profile, info) {    
    const currentUser = await Oauth2User.findOne({
      sceibaId: profile.user.id
    });
    if (err) {
      return next(err);
    }
    if (!profile) {
      return res.redirect('/api/oauth2');
    }
    req.logIn(profile, function (err) {
      if (err) {
        return next(err);
      }
      return res.redirect(`https://localhost:4200?sceibaId=${profile.user.id}&token=${profile.access_token}`);
    });
  })(req, res, next);
});

router.get('/api/logout', function (req, res) {
  req.logout();
  res.redirect('/oauth2');
});

/* router.get('/logout', function(req, res){
  req.session.destroy(() => res.redirect('https://localhost:3000'));
  
}); */

module.exports = router;