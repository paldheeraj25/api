//DB connection
var db = "mongodb://localhost/lewiot";

//Mongo model
var models = {};
models.base = "./models";
models.products = models.base + "/products";
models.users = models.base + "/users";
models.batches = models.base + "/batches";

//RestFul APIs
var apis = {};
apis.base = "/api";
apis.products = apis.base + "/products";
apis.users = apis.base + "/users";
apis.batches = apis.base + "/batches";

module.exports = {
  db : db,
  apis: apis,
  models: models
}