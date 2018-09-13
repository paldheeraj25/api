var express = require('express'), router = express.Router();

//get all
router.get('/api/college/upload', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    return res.send("Api works!!!!");
  });

module.exports = router;

