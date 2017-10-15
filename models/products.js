var mongoose = require("mongoose");
var productSchema = mongoose.Schema({
  batchId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  metadata: [{ name: String, value: String, show: Boolean }]
});

var Products = module.exports = mongoose.model('Products', productSchema);
//get genres
module.exports.getAll = function (callback, limit) {
  Products.find(callback).limit(limit);
};

module.exports.getOne = function (tagid, callback) {
  Products.findOne({ tagid: tagid }, callback);
};

module.exports.save = function (product, callback) {
  var Product = new Products(product);
  Product.save(callback);
};