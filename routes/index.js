// Author : Lewiot
// Created : Sep 2017
// Index.js : This is a index file mainly used for routing all APIs to their respective js files

var express = require('express'), router = express.Router();

//users route
app.use(require('./users/users'));

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

//auth route
app.use(require('./auth/auth'));

//students route
app.use(require('./college/colleges'));

//payment routes
app.use(require('./instamojo/instamojo'));

//dialogflow webhook
app.use(require('./dialogflow-webhook/dialogflow-webhook'));

//chatfuel
app.use(require('./chatfuel/bot-user'));
app.use(require('./chatfuel/chatfuel'));
app.use(require('./chatfuel/flower'));
app.use(require('./chatfuel/cart'));
app.use(require('./chatfuel/order-reciept'));
app.use(require('./chatfuel/preapare-payment'));
app.use(require('./chatfuel/track'));

module.exports = router;