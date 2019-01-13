// Author : Lewiot
// Created : Sep 2017
// Index.js : This is a index file mainly used for routing all APIs to their respective js files

var express = require('express'), router = express.Router();

//users route
app.use(require('./users/users'));

// crypto ipl
app.use(require('./cryptoipl/cryptoipl'));

//product route
app.use(require('./products/products'));

//jewel route
app.use(require('./jewel/jewel'));

//Design route
var jeweldesign = require('./jeweldesign/jeweldesign');
app.use(jeweldesign);

//app data
app.use(require('./appdata/appdata'));

//ad route
app.use(require('./advertisements/advertisements'));

//grocery route
app.use(require('./grocery/groceryController'));

//auth route
app.use(require('./auth/auth'));

//students route
app.use(require('./students/students'));

//students route
app.use(require('./college/colleges'));

//payment routes
app.use(require('./instamojo/instamojo'));

//dialogflow webhook
app.use(require('./dialogflow-webhook/dialogflow-webhook'))

//chatfuel
app.use(require('./chatfuel/chatfuel'))


module.exports = router;