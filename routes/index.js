
var express = require('express'), router = express.Router();

app.use(require('./products/products'));
app.use(require('./appdata/appdata'));
app.use(require('./auth/auth'));

module.exports = router;