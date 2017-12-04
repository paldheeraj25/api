var express = require('express'), router = express.Router();

//get all
router.get('/api/advertisement', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    res.send({ test: "test" });
  });

module.exports = router;

