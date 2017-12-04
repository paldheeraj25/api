var express = require('express'), router = express.Router();

//get all
router.get('/api/appData', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    AppData.getAll(function (err, appData) {
      if (err) {
        throw err;
      }
      return res.send(appData);
    });
  });

router.get('/api/appData' + '/:id',
  function (req, res) {
    var uid = req.params.id;
    AppData.getOne(uid, function (err, appData) {
      if (err) {
        throw err;
      }
      return res.send(appData);
    });
  });

router.put('/api/appData' + '/:id',
  function (req, res) {
    var updateObject = { uid: req.params.id, TimeStampServer: req.body.timestamp };
    AppData.updateOne(updateObject, function (err, appData) {
      if (err) {
        throw err;
      }
      return res.send(appData);
    });
  });


module.exports = router;

