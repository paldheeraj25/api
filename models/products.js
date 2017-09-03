var mongoose = require("mongoose");
var productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  manufacture_date: {
    type: String,
    required: false
  },
  expiry_date: {
    type: String,
    required: false
  }
});

var Products = module.exports = mongoose.model('Products', productSchema);
//get genres
module.exports.getAll = function (callback, limit) {
  Products.find(callback).limit(limit);
}

module.exports.getOne = function (tagid, callback) {
  Products.findOne({ tagid: tagid }, callback);
}