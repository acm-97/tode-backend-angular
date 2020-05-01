const express = require('express');
const cors = require('cors');
const app = express();
const passport = require("passport");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser"); // parse cookie header
const config = require("config")
const session = require("express-session")
const morgan = require('morgan')
var bodyParser = require('body-parser');

// 
// instal morgan for routes
// 

if (config.get("behind-proxy") === true)
  app.set('trust proxy', 1)


app.use(cors());
// parse cookies
app.use(
  cookieSession({
    name: "session",
    keys: "thisappisawesome",
    maxAge: 24 * 60 * 60 * 100
  })
);

app.use(cookieParser());

app.use(session({
  secret: config.get('secret-session'),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true
  }
}));

// initalize passport
app.use(passport.initialize());

app.use(passport.session());

app.use(
  cors({
    origin: "https://localhost:4200", // allow to server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

app.use(morgan('dev'))
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

/* app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true})); */

//routes
app.use(require('./routes/user.routes'));
app.use(require('./routes/auth.routes'));
app.use(require('./routes/message.routes'));
app.use(require('./routes/document.routes'));
app.use(require('./routes/document_version.routes'));
app.use(require('./routes/permision.routes'));
app.use(require('./routes/notification.routes'));

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated"
    });
  } else {
    next();
  }
};

app.get("/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies
  });
});

module.exports = app;