// Author : Lewiot
// Created : Sep 2017
// This file acts as API creator for user-management and to fetch data from mongo db

var express = require('express'), router = express.Router();
var passport = require("passport");
// var passportJWT = require("passport-jwt");

// var ExtractJwt = passportJWT.ExtractJwt;
// var JwtStrategy = passportJWT.Strategy;

/* Users APIs */
router.get('/api/users', passport.authenticate('jwt', { session: false }), function (req, res) {
  console.log("users called");
  Users.getAll(function (err, users) {
    if (err) {
      throw err;
    }
    return res.send(users);
  });
});

router.delete('/api/users' + '/:id', passport.authenticate('jwt', { session: false }), function (req, res) {
  Users.delete(req.params.id, function (err, user) {
    if (err) {
      throw err;
    }
    return res.send(user);
  });
});


module.exports = router;