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

router.post('/api/cryptoipl/sendmail', function( req, res) {
  console.log(req.body);
  const obj = req.body;
  for( var i=0; i < 2; i++) {
    wallet = i == 0 ? obj.oldOwner : obj.newOwner;
    Cryptoipl.getOne("0x584e20986ac344adeb007ecc9d901c31db154624", function (err, cryptoipl) {
      if (err) {
        throw err;
      }
      if( !cryptoipl ) {
        return 
      }
      console.log("response : ", cryptoipl);
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

      var fromMsg = "Congratulations from Crypto IPL Team. Your team " + 
        obj.name + " has been successfully sold for price " + obj.oldPrice;
      var toMsg = "Congratulations from Crypto IPL Team. You successfully have aquired new team " + obj.name + " for price " + obj.oldPrice + 
      ". You would get new price " + obj.newPrice + " if someone owns it.";

      var message = i == 0 ? fromMsg : toMsg;
      console.log("i value: ",i);

      console.log("message: ", message);

      let mailOptions = {
          from: '"Maloth Naresh" <idofmalothnaresh@gmail.com>',
          to: cryptoipl.email,
          subject: 'Crypto IPL notice',
          text: message
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent!');
          console.log('Info: ', info);
      });
    });
  }

});

module.exports = router;