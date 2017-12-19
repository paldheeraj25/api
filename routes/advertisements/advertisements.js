var express = require('express'), router = express.Router();

//get all
router.get('/api/advertisement', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    Advertisement.getAd(function (err, ad) {
      if (err)
        throw err;

      return res.send(ad);
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

