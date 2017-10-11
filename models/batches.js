var mongoose = require("mongoose");
var batchSchema = new mongoose.Schema({
  batchId: {
    type: String,
    required: true
  },
  tagId: {
    type: Array,
    required: true
  }
});

var Batches = module.exports = mongoose.model('Batches', batchSchema);
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