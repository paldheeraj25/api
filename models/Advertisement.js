var mongoose = require("mongoose");
var AdvertisementSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: false
  },
  product: {
    type: String,
    required: false
  }
});

var Batches = module.exports = mongoose.model('advertisement', AdvertisementSchema);
//get genres
module.exports.getAll = function (callback, limit) {
  Batches.find(callback).limit(limit);
};

module.exports.getOne = function (tagid, callback) {
  Batches.findOne({ tagid: tagid }, callback);
};

module.exports.save = function (batchInfo, callback) {
  console.log(batchInfo);
  var batch = new Batches(batchInfo);
  batch.save(callback);
};