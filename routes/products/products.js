// Author : Lewiot
// Created : Sep 2017
// This file acts as API creator for products management and to fetch data from mongo db

/*jshint esversion: 6 */
var express = require('express'), router = express.Router();
const _ = require('lodash');
const path = require('path');
const multer = require('multer');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

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
router.get('/api/products', passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Products.getAll(function (err, products) {
      if (err) {
        throw err;
      }
      return res.send(products);
    });
  });


//get one
router.get('/api/products/:id', function (req, res) {
  var batchId = req.params.id;
  return Products.getOne(batchId, function (err, product) {
    if (err) {
      throw err;
    }
    _.each(product.metadata, function (meta) {
      if (meta.name === "tap") {
        meta.value = parseInt(meta.value) + 1;
      }
    });
    Products.updateTap(product, function (err, productUpdate) {
      if (err) {
        throw err;
      }
    });
    return res.send(product);
  });
});

//upload product check: check for passport authentication via making const passport global or use here
router.post('/api/upload',//passport.authenticate('jwt', { session: false }),
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
        { name: "city", value: batchData.city, show: true },
        { name: "tap", value: "0", show: true },
        { name: "sold", value: "0", show: true },
        { name: "man or machine", value: batchData.manOrMachine, show: true },
        { name: "gold carat", value: batchData.goldCarat, show: true },
        { name: "percent charge", value: batchData.percentChrg, show: true },
        { name: "gross weight", value: batchData.grossWeight, show: true },
        { name: "net weight", value: batchData.netWeight, show: true },
        { name: "stone weight", value: batchData.stoneWeight, show: true },
        { name: "beads weight", value: batchData.beadsWeight, show: true },
        { name: "per gram weight", value: batchData.perGramWeight, show: true }
      ],
      engagement: {
        PartitionKey: 'Lewiot',
        RowKey: batchId,
        Timestamp: "2016-11-10 09:25:25",
        CountRollingCodeError: 24,
        CountRollingCodeOK: 4,
        CountTimeStampError: 9,
        LastCountRollingCodeError: "2017-11-20 06:29:35",
        LastCountRollingCodeOK: "2017-11-23 10:37:56",
        LastCountTimeStampError: "2017-11-23 10:38:07",
        RollingCodeServer: "613C6CD4",
        SecretKey: "FFFFFF" + batchId,
        TamperFlag: "00",
        TamperStatusOpened: "false",
        TimeStampServer: -1
      }
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



module.exports = router;

