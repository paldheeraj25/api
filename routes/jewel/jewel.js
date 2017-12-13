/*jshint esversion: 6 */
var express = require('express'), router = express.Router();
const _ = require('lodash');
const path = require('path');
const multer = require('multer');

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
router.get('/api/products', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Products.getAll(function (err, products) {
      if (err) {
        throw err;
      }
      return res.send(products);
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



module.exports = router;

