// Author : Lewiot
// Created : Sep 2017
// This file acts as API creator for crypto ipl

var express = require('express'), router = express.Router();
var passport = require("passport");

/* Users APIs */
router.get('/api/cryptoipl', function (req, res) {
  Cryptoipl.getAll(function (err, cryptoipl) {
    if (err) {
      throw err;
    }
    return res.send(cryptoipl);
  });
});

router.get('/api/cryptoipl/:wallet', function( req, res ) {
  var wallet = req.params.wallet;
  return Cryptoipl.getOne(wallet, function (err, cryptoipl) {
    if (err) {
      throw err;
    }
    return res.send(cryptoipl);
  });
});

router.post('/api/cryptoipl/saveinfo', function( req, res ) {
  var team = req.body;
  return Cryptoipl.saveinfo(team, function (err, team) {
    if (err)
      throw err;
    return res.status(200).json({ data: team });
  });
});

router.post('/api/cryptoipl/:id/updateinfo', function( req, res ) {
  var team = req.body;
  return Cryptoipl.updateinfo(team, function (err, team) {
    if (err)
      throw err;
    return res.status(200).json({ data: team });
  });
});

module.exports = router;