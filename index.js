var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var constants = require('./consts');
var authService = require('./authService');

//var expressValidator = require('express-validator');
var session = require('express-session');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require("passport-jwt");
var util = require('util');
const csvparse = require('js-csvparser');
const _ = require('lodash');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'secret';

//app config
app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
//app.use(expressValidator());
app.use(passport.initialize());

app.use('/', express.static('./dist'));
app.use('/lara', express.static('./www'));

//database models
Products = require(constants.models.products);
Users = require(constants.models.users);
Batches = require(constants.models.batches);
AppData = require(constants.models.apps);

//Connecg to mongoose
mongoose.connect(constants.db);
var db = mongoose.connect;
const cors = require('cors');

app.use(cors({ origin: "*" }));

//api's
app.get('/', function (req, res) {
  res.send('Welcome to Lewiot');
});

app.use(require('./routes'));

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
  // usually this would be a database call:
  Users.findOne({ _id: jwt_payload.id }, function (err, user) {
    if (err) { return done(err, false); }
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  });
}));


app.listen(80);
console.log('Server runnning on port 5012');
