var express = require('express');
app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
Products = require('./models/products');
//Connecg to mongoose
mongoose.connect('mongodb://localhost/lewiot/users');
var db = mongoose.connect;
const cors = require('cors');
app.use(cors({ origin: "*" }));

app.get('/', function (req, res) {
  res.send('api server');
});

app.get('/api/products', function (req, res) {
  Products.getAll(function (err, products) {
    if (err) {
      throw err;
    }
    return res.send(products);
  });
});

app.get('/api/products/:id', function (req, res) {
  var tagId = req.headers.id;
  return Products.getOne(tagId, function (err, product) {
    if (err) {
      throw err;
    }
    return res.send(product);
  });
});

app.listen(3333);
console.log('Server runnning on port 3333');
