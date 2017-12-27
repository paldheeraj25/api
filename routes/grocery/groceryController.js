/*jshint esversion: 6 */
var express = require('express'), router = express.Router();
const _ = require('lodash');

//save
app.post('/api/grocery', function (req, res) {
  var grocery = req.body;
  var date = new Date();
  grocery.date = date.getDate().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getFullYear().toString();
  grocery.delivered = false;
  Groceries.save(grocery, function (err, grocery) {
    if (err) {
      throw err;
    }

    //oneSignal Test
    var request = require('request');
    var sendMessage = function (device, message) {
      var restKey = '';
      var appID = '';
      request(
        {
          method: 'POST',
          uri: 'https://onesignal.com/api/v1/notifications',
          headers: {
            "authorization": "Basic " + restKey,
            "content-type": "application/json"
          },
          json: true,
          body: {
            'app_id': appID,
            'headings': { "en": "Lara" },
            'contents': { en: message },
            'include_player_ids': Array.isArray(device) ? device : [device]
          }
        },
        function (error, response, body) {
          if (!body.errors) {
            console.log(body);
          } else {
            console.error('Error:', body.errors);
          }

        }
      );
    };
    sendMessage(['8c6ba97d-74dc-49a6-a8e7-56fc5e0ad64d', '2ae7dd0e-160d-4b21-9ab9-01ff84bba938'], 'Order recieved!');

    return res.send(grocery);
  });
});


//get groceries
app.get('/api/grocery', function (req, res) {
  Groceries.getAll(function (err, groceries) {
    if (err) {
      throw err;
    }
    return res.send(groceries);
  });
});

//get by date
router.get('/api/grocery/:date', function (req, res) {

  var dateString = req.params.date;
  Groceries.getByDate(dateString, function (err, grocery) {
    if (err) {
      throw err;
    }
    return res.send(grocery);
  });
});

//update delivery
router.get('/api/grocery/delivered/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  Groceries.updateDelivery(id, function (err, grocery) {
    if (err)
      throw (err);
    res.send(grocery);
  });
});





module.exports = router;

