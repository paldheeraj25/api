/*jshint esversion: 6 */
var express = require('express'), router = express.Router();
const _ = require('lodash');
const path = require('path');
const multer = require('multer');

//sms api initialization
const Nexmo = require('nexmo');
const nexmo = new Nexmo({
  apiKey: 'd930eae1',
  apiSecret: '4691606a0b4360a2'
});
// Twilio Credentials 
var accountSid = 'ACe3605c1a18c2c187f147efe8e1382f37';
var authToken = 'b7d7850a99f0f83bfd4de4269229c91b';

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken);

//Set storage engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

//Init uplaod var
const upload = multer({
  storage: storage
}).single('file');

app.post('/api/uploadImage', function (req, res) {
  upload(req, res, function (err) {
    //console.log(req.file);
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    res.send(req.file);
  });
});
//get all
router.get('/api/jewel', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Jewels.getAll(function (err, jewels) {
      if (err) {
        throw err;
      }
      return res.send(jewels);
    });
  });


//get one
router.get('/api/jewel/:id', function (req, res) {
  var code = req.params.id;
  return Jewels.getOne(code, function (err, jewel) {
    if (err) {
      throw err;
    }
    return res.send(jewel);
  });
});

//update jewel
router.put('/api/jewel', function (req, res) {
  var jewel = req.body;
  Jewels.updateOne(jewel, function (err, jewel) {
    if (err)
      throw (err);
    res.send(jewel);
  });
});

//jewel save: check for passport authentication via making const passport global or use here
router.post('/api/jewel',//passport.authenticate('jwt', { session: false }),
  function (req, res) {
    var jewel = req.body;
    jewel.tap = 0;
    jewel.sold = 0;
    Jewels.save(jewel, function (err, jewel) {
      if (err)
        return err;
      return res.send(jewel);
    });
  });

//get and updateTap
router.get('/api/jewel/get/update/:id', function (req, res) {
  var code = req.params.id;
  return Jewels.getOne(code, function (err, jewel) {
    if (err) {
      throw err;
    }
    Jewels.updateTap(jewel, function (err, jewel) {
      if (err) {
        throw err;
      }
      return true;
    });
    return res.send(jewel);
  });
});

//share jewel
router.post('/api/jewel/share', function (req, res) {

  var message = req.body;

  client.messages.create({
    to: "+91" + message.number,
    from: "+18029921408",
    body: message.jewel,
  }, function (err, message) {
    if (err)
      res.send(err);
    console.log(message.sid);
    res.send(message.sid);
  });
  // nexmo.message.sendSms(
  //   'NEXMO', '91' + message.number, message.jewel, { type: 'unicode' }, (err, responseData) => {
  //     if (err) {
  //       throw err;
  //     } else {
  //       res.send(responseData);
  //     }
  //   }
  // );
});


module.exports = router;

