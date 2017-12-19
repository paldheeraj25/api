
var express = require('express'), router = express.Router();

//product rout
app.use(require('./products/products'));

//jewel rout
app.use(require('./jewel/jewel'));

//Design rout
var jeweldesign = require('./jeweldesign/jeweldesign');
app.use(jeweldesign);

//app data
app.use(require('./appdata/appdata'));

//ad rout
app.use(require('./advertisements/advertisements'));

//auth rout
app.use(require('./auth/auth'));

module.exports = router;