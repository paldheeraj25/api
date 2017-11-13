var express = require('express');
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


//database models
Products = require(constants.models.products);
Users = require(constants.models.users);
Batches = require(constants.models.batches);

//Connecg to mongoose
mongoose.connect(constants.db);
var db = mongoose.connect;
const cors = require('cors');

app.use(cors({ origin: "*" }));

//api's
app.get('/', function (req, res) {
  res.send('api server');
});

app.get(constants.apis.products, passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Products.getAll(function (err, products) {
      if (err) {
        throw err;
      }
      return res.send(products);
    });
  });

app.get('/api/advertisement', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.send({ test: "test" });
  });
//passport.authenticate('jwt', { session: false }),
app.post('/api/upload',
  function (req, res) {

    var batchData = req.body.metadata;
    var batchId = req.body.metadata.batchId;
    var batchTagids = req.body.idList;
    var productDetails = {
      batchId: batchId,
      name: batchData.name,
      metadata: [
        { name: "image", value: batchData.image, show: true },
        { name: "heading", value: batchData.heading, show: true },
        { name: "description", value: batchData.description, show: true },
        { name: "manufacture", value: batchData.manufacture, show: true },
        { name: "expire", value: batchData.expire, show: true },
        { name: "country", value: batchData.country, show: true },
        { name: "city", value: batchData.city, show: true }
      ]
    };
    Batches.save({ batchId: batchId, tagId: batchTagids }, function (err, batch) {
      if (err)
        return err;
      Products.save(productDetails, function (err, product) {
        if (err)
          throw err;
        return res.status(200).json({ data: product });
      });
    });
  });

app.get(constants.apis.products + ':id', function (req, res) {
  var tagId = req.headers.id;
  return Products.getOne(tagId, function (err, product) {
    if (err) {
      throw err;
    }
    return res.send(product);
  });
});

app.post(constants.login,
  function (req, res) {
    authService.login(req, res);
  });

app.get(constants.logout, function (req, res) {
  authService.logout(req, res);
});

/* Users APIs */
app.get(constants.apis.users, function(req, res) {
  Users.getAll(function (err, users) {
    if (err) {
      throw err;
    }
    return res.send(users);
  });
});

app.post('/api/register', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    authService.register(req, res);
  });

app.delete(constants.apis.users + '/:id', function(req, res){
  Users.delete(req.params.id, function (err, user) {
    if (err) {
      throw err;
    }
    return res.send(user);
  });
});

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


app.listen(5012);
console.log('Server runnning on port 5012');
