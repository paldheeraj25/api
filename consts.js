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
models.jeweldesign = models.base + "/jeweldesign";


//RestFul APIs
var apis = {};
apis.base = "/api";
var login = apis.base + "/login";
var logout = apis.base + "/logout";

apis.products = apis.base + "/products";
apis.users = apis.base + "/users";
apis.batches = apis.base + "/batches";
apis.appData = apis.base + "/appData";

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