var mongoose = require("mongoose");
var batchSchema = mongoose.Schema({
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