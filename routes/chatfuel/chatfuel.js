var express = require('express'), router = express.Router();

//get all
router.get('/api/chatfuel/test', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    const message = {
      "messages": [
        { "text": "Welcome to the Chatfuel Rockets!" },
        { "text": "What are you up to?" }
      ]
    };
    res.send(message);
  });

module.exports = router;

