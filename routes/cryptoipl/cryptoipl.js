// Author : Lewiot
// Created : Sep 2017
// This file acts as API creator for crypto ipl

var express = require('express'), router = express.Router();
var passport = require("passport");

const nodemailer = require('nodemailer');

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

mailSender = function(to, msg) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 25,
    secure: false,
    auth: {
        user: "idofmalothnaresh@gmail.com",
        pass: "kishan028"
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  let mailOptions = {
      from: '"Maloth Naresh" <idofmalothnaresh@gmail.com>',
      to: to,
      subject: 'Crypto IPL notice',
      text: msg
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return error;
    }
    console.log('Message sent!');
    console.log('Info: ', info);
  });
}

router.post('/api/cryptoipl/sendmail', function( req, res) {
  const obj = req.body;
    wallet = obj.oldOwner
    Cryptoipl.getOne(wallet, function (err, cryptoipl) {
      if (err) {
        throw err;
      }
      if( !cryptoipl ) {
        return 
      }

      // Old owner mail
      var fromMsg = "Congratulations from Crypto IPL Team. Your team " + 
        obj.name + " has been successfully sold for price " + obj.oldPrice;
      mailSender(cryptoipl.email, fromMsg);
      
    });
    
    // New owner mail
    wallet = obj.newOwner
    Cryptoipl.getOne(wallet, function (err, cryptoipl) {
      if (err) {
        throw err;
      }
      if( !cryptoipl ) {
        return 
      }

      var toMsg = "Congratulations from Crypto IPL Team. You successfully have aquired new team " + obj.name + " for price " + obj.oldPrice + 
        ". You would get new price " + obj.newPrice + " if someone aquires it.";
      mailSender(cryptoipl.email, toMsg);
      
    });

    return res.json({
      success: true,
      status: 'Successfully Registered User, Check Email To Activate'
    });

});

module.exports = router;