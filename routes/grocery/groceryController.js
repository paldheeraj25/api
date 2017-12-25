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

