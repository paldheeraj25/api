// Author : Lewiot
// Created : Sep 2017
// This file is used for defining all the constant routes for service calls and db querying

//DB connection
var db = "mongodb://localhost/lewiot";

//Mongo model
var models = {};
models.base = "./models";
models.products = models.base + "/products";
models.users = models.base + "/users";
models.batches = models.base + "/batches";
models.apps = models.base + "/apps";
models.jewel = models.base + "/jewel";
models.advertisement = models.base + "/Advertisement";
models.jeweldesign = models.base + "/jeweldesign";
models.grocery = models.base + "/groceryModel";
models.cryptoipl = models.base + "/cryptoipl";


//RestFul APIs
var apis = {};
apis.base = "/api";
var login = apis.base + "/login";
var logout = apis.base + "/logout";

apis.products = apis.base + "/products";
apis.users = apis.base + "/users";
apis.batches = apis.base + "/batches";
apis.appData = apis.base + "/appData";
apis.cryptoipl = apis.base + "/cryptoipl";

//for jewel
apis.jewel = apis.base + "/jewel";

apis.jeweldesign = apis.base + "/design/jewel";

module.exports = {
  db: db,
  apis: apis,
  login: login,
  logout: logout,
  models: models
}