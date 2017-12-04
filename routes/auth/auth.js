var express = require('express'), router = express.Router();
var authService = require('../../authService');

router.post('/api/login',
  function (req, res) {
    console.log("in login function");
    authService.login(req, res);
  });

router.get('/api/logout', function (req, res) {
  authService.logout(req, res);
});

router.post('/api/register', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    authService.register(req, res);
  });


module.exports = router;