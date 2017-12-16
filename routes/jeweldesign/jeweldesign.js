/*jshint esversion: 6 */
var express = require('express');
var router = express.Router();
const _ = require('lodash');
const path = require('path');


//get all
router.get('/api/design/jewels', //passport.authenticate('jwt', { session: false }),
function (req, res) {
  console.log("API called");
  jeweldesign.getAll(function (err, design) {
    if (err) {
      throw err;
    }
    return res.send(design);
  });
});

//get one
router.get('/api/design/jewel/:id', function (req, res) {
  var id = req.params.id;
  return jeweldesign.getOne(id, function (err, design) {
    if (err) {
      throw err;
    }
    return res.send(design);
  });
});

//update jewel
router.put('/api/design/jewel', function (req, res) {
  var design = req.body;
  jeweldesign.updateOne(design, function (err, design) {
    if (err)
      throw (err);
    res.send(design);
  });
});

//jewel save: check for passport authentication via making const passport global or use here
router.post('/api/design/jewel',//passport.authenticate('jwt', { session: false }),
  function (req, res) {
    var design = req.body;
    jeweldesign.save(design, function (err, design) {
      if (err)
        return err;
      return res.send(jewel);
    });
  });

  module.exports = router;