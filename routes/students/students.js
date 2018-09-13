var express = require('express'), router = express.Router();

//get all
router.get('/api/students', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Students.getAll(function (err, students) {
      if (err)
        throw err;

      return res.send(students);
    });
  });

router.post('/api/advertisement', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    var ad = req.body;
    Advertisement.save(ad, function (err, ad) {
      if (err)
        throw err;

      return res.send(ad);
    });
  });

module.exports = router;

