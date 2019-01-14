var express = require('express'), router = express.Router();

// lodash
const _ = require('lodash');

const intentModule = require('./intents/intents');
var dialogflowResponse = require('../../models/dialogflow-response.json');

router.post('/api/dialoglow',
  function (req, res) {
    fulfillmentRequest = req.body;
    var intentResponse = '';
    return intentModule.intents(fulfillmentRequest, function (response) {
      return res.send(response);
    });
  });

module.exports = router;

