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
  image: {
    type: {
      url: String,
      show: Boolean
    },
    required: false
  },
  heading: {
    type: {
      value: String,
      show: Boolean
    },
    required: false
  },
  description: {
    type: {
      value: String,
      show: Boolean
    },
    required: false
  },
  city: {
    type: {
      value: String,
      show: Boolean
    },
    required: false
  },
  country: {
    type: {
      value: String,
      show: Boolean
    },
    required: false
  },
  manufacture: {
    type: {
      value: String,
      show: Boolean
    },
    required: false
  },
  expire: {
    type: {
      value: String,
      show: Boolean
    },
    required: false
  }
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