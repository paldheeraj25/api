var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
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
Products = require('./models/products');
Users = require('./models/users');
Batches = require('./models/batches');

//Connecg to mongoose
mongoose.connect('mongodb://localhost/lewiot/users');
var db = mongoose.connect;
const cors = require('cors');

app.use(cors({ origin: "*" }));

//api's
app.get('/', function (req, res) {
  res.send('api server');
});

app.get('/api/products', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Products.getAll(function (err, products) {
      if (err) {
        throw err;
      }
      return res.send(products);
    });
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
        { name: "image", url: batchData.image, show: true },
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

app.get('/api/products/:id', function (req, res) {
  var tagId = req.headers.id;
  return Products.getOne(tagId, function (err, product) {
    if (err) {
      throw err;
    }
    return res.send(product);
  });
});

app.get('/api/logout', function (req, res) {
  //right now clearing session may need to change
  res.send("logout");

});

app.post('/api/login',
  function (req, res) {
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
  });

app.get('/api/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.send({ success: 'logout successfull' });
});

app.post('/api/register', passport.authenticate('jwt', { session: false }),
  function (req, res) {
    console.log(req.body);
    // req.checkBody('username', 'username cannot be empaty').notEmpty();
    // req.checkBody('email', 'The email you entered is invalid').isEmail();
    // const error = req.validationErrors();
    // if (error) {
    //   res.send(error);
    // }
    var user = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      active: req.body.active
    };

    return Users.findOne({ email: user.email }).then(function (data) {
      if (data) {
        return res.send({ error: 'user already exist' });
      } else {
        bcrypt.hash(user.password, saltRounds, function (err, hash) {
          Users.create({ 'username': user.username, 'email': user.email, 'password': hash }).then(function (data) {
            if (data) {
              var id = data._id;
              req.login(id, function (err) {
                if (!err) {
                  //console.log(req.user);
                  //console.log(req.isAuthenticated());
                  res.send(data);
                } else {
                  throw error;
                }
              });
            }
          });
        });
      }
    }, function (error) {
      throw error;
    });
  });

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, done) {
  console.log('payload received', jwt_payload);
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
