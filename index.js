var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var util = require('util');
var bcrypt = require('bcryptjs');
const saltRounds = 10;

//app config
app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(expressValidator());
var store = new MongoDBStore(
  {
    uri: 'mongodb://localhost/lewiot',
    collection: 'mySessions'
  });

// Catch errors 
store.on('error', function (error) {
  assert.ifError(error);
  assert.ok(false);
});
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: store
  //cookie: { secure: true }
}));
app.use(passport.initialize());
app.use(passport.session());


//database models
Products = require('./models/products');
Users = require('./models/users');

//Connecg to mongoose
mongoose.connect('mongodb://localhost/lewiot/users');
var db = mongoose.connect;
const cors = require('cors');

app.use(cors({ origin: "*" }));

//api's
app.get('/', function (req, res) {
  res.send('api server');
});

app.get('/api/products', function (req, res) {
  Products.getAll(function (err, products) {
    if (err) {
      throw err;
    }
    return res.send(products);
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
  console.log('logout');
  //right now clearing session may need to change
  store.clear(function (error) {
    if (error)
      throw error;
    res.send("logout");
  });

});

app.post('/api/login', passport.authenticate('local'), function (req, res) {
  res.send({ success: 'login successfull' });
});

app.get('/api/logout', function (req, res) {
  req.logout();
  req.session.destroy();
  res.send({ success: 'logout successfull' });
});

app.post('/api/register', function (req, res) {

  req.checkBody('username', 'username cannot be empaty').notEmpty();
  req.checkBody('email', 'The email you entered is invalid').isEmail();
  const error = req.validationErrors();
  if (error) {
    res.send(error);
  }
  var user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
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

//passport js for authentication
passport.serializeUser(function (id, done) {
  done(null, id);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

function authenticationMiddleware() {
  return (req, res, next) => {
    console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);
    if (req.isAuthenticated()) return next();
    return res.send({ 'error': 'unauthorised' });
  };
}

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function (username, password, done) {
    Users.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      // if (!user.validPassword(password)) {
      //   return done(null, false, { message: 'Incorrect password.' });
      // }
      //console.log(user);
      var hash = user.password;
      bcrypt.compare(password, hash, function (err, res) {
        //console.log(res);
        if (res === true) {
          return done(null, { id: user._id });
        } else {
          return done(null, false, { 'error': 'incorrect password' });
        }
      });

      //console.log(username);
      //console.log(password);
    });
  }
));

app.listen(5012);
console.log('Server runnning on port 5012');
