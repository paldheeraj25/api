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
  metadata: [{ name: String, value: String, show: Boolean }],
  engagement: {
    PartitionKey: String,
    RowKey: String,
    Timestamp: String,
    CountRollingCodeError: Number,
    CountRollingCodeOK: Number,
    CountTimeStampError: Number,
    LastCountRollingCodeError: String,
    LastCountRollingCodeOK: String,
    LastCountTimeStampError: String,
    RollingCodeServer: String,
    SecretKey: String,
    TamperFlag: String,
    TamperStatusOpened: String,
    TimeStampServer: Number
  }
});

var Products = module.exports = mongoose.model('Products', productSchema);
//get products
module.exports.getAll = function (callback, limit) {
  Products.find(callback).limit(limit);
};

module.exports.getOne = function (batchId, callback) {
  console.log(batchId);
  Products.findOne({ batchId: batchId }, callback);
};

module.exports.save = function (product, callback) {
  var Product = new Products(product);
  Product.save(callback);
};

module.exports.updateOne = function (product, callback) {
  Product.update(
    { RowKey: product.uid },
    {
      TimeStampServer: product.TimeStampServer
    },
    callback
  );
};

module.exports.updateTap = function (product, callback) {
  Products.update(
    { batchId: product.batchId },
    {
      metadata: product.metadata
    },
    callback
  );
};