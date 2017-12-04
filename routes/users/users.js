var express = require('express'), router = express.Router();

/* Users APIs */
router.get('/api/users', function (req, res) {
  Users.getAll(function (err, users) {
    if (err) {
      throw err;
    }
    return res.send(users);
  });
});

router.delete('/api/users' + '/:id', function (req, res) {
  Users.delete(req.params.id, function (err, user) {
    if (err) {
      throw err;
    }
    return res.send(user);
  });
});


module.exports = router;