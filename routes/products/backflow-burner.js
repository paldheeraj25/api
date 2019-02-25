var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('../chatfuel/firebase');
var firebase = firebaseModule.firebase();

// lodash
const _ = require('lodash');

router.get('/api/products/backflow-burder/detail',
  function (req, res) {
    // messengerUserId
    const id = req.query["id"];
    firebase.database().ref('send_them_flowers/prodcuts/backflowburner/' + id).once('value')
      .then(function (snapshot) {
        return res.send(snapshot);
      }).catch(err => {
        return res.send(err);
      });
  });

router.get('/api/products/backflow-burder/list',
  function (req, res) {
    // messengerUserId
    const id = req.query["id"];
    firebase.database().ref('send_them_flowers/prodcuts/backflowburner/').once('value')
      .then(function (snapshot) {
        return res.send(snapshot);
      }).catch(err => {
        return res.send(err);
      });
  });

router.get('/api/products/juice/list',
  function (req, res) {
    // messengerUserId
    const id = req.query["id"];
    firebase.database().ref('send_them_flowers/juice-list/').once('value')
      .then(function (snapshot) {
        return res.send(snapshot);
      }).catch(err => {
        return res.send(err);
      });
  });


module.exports = router;
