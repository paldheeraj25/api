var mongoose = require("mongoose");
var productSchema = mongoose.Schema({
  list: {
    type: Array,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  delivered: {
    type: Boolean,
    required: false
  }

});

var Grocery = module.exports = mongoose.model('groceries', productSchema);

//get groceries
module.exports.getAll = function (callback, limit) {
  Grocery.find(callback).limit(limit);
};

//get one
module.exports.getByDate = function (date, callback) {
  Grocery.find({ date: date }, callback);
};

//save grocery
module.exports.save = function (grocery, callback) {
  var Grocery = new Groceries(grocery);
  Grocery.save(callback);
};

