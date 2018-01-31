var constants = require('./consts');
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

Users = require(constants.models.users);

module.exports.login = function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  Users.findOne({ email: email }, function (err, user) {
    if (err) { return done(err); }
    if (!user) {
      return res.status(401).json({ message: "no such user found" });
    }
    var hash = user.password;
    bcrypt.compare(password, hash, function (err, reponse) {
      if (reponse === true) {
        var payload = { id: user._id };
        var token = jwt.sign(payload, jwtOptions.secretOrKey);
        return res.send({ message: "ok", token: token });
      } else {
        return res.status(401).json({ message: "passwords did not match" });
      }
    });
  });
}

module.exports.logout = function(req, res) {
  req.logout();
  res.send({ success: 'logout successfull' });
}

module.exports.register = function(req, res) {
  var user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
    active: req.body.active
  };
  bcrypt.hash(user.password, saltRounds, function (err, hash) {
      user.password = hash;
      Users.addUser(user, function (err, user) {
        if (err) {
          throw err;
        }
        return res.send(user);
      });
  });
}