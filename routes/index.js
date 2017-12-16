
var express = require('express'), router = express.Router();

app.use(require('./products/products'));
app.use(require('./jewel/jewel'));

var jeweldesign = require('./jeweldesign/jeweldesign');
app.use(jeweldesign);
app.use(require('./appdata/appdata'));
app.use(require('./auth/auth'));

module.exports = router;