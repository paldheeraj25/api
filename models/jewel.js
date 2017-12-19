var mongoose = require("mongoose");
var productSchema = mongoose.Schema({
  //parameter will get from frontend
  name: String,
  code: String,
  description: String,
  city: String,
  branch: String,
  goldCarat: Number,
  percentageChrg: Number,
  grossWeight: Number,
  netWeight: Number,
  stoneWeight: Number,
  beadsWeight: Number,
  perGramWeight: Number,
  //image name is from multer
  image: String,
  //api and business logic related
  tap: Number,
  sold: Number
});

var Jewel = module.exports = mongoose.model('Jewels', productSchema);
//get Jewels
module.exports.getAll = function (callback, limit) {
  Jewel.find(callback).limit(limit);
};

//get jewel by id
module.exports.getOne = function (jewelCode, callback) {
  Jewel.findOne({ code: jewelCode }, callback);
};

//save jewel
module.exports.save = function (jewel, callback) {
  var Jewel = new Jewels(jewel);
  Jewel.save(callback);
};

module.exports.updateOne = function (jewel, callback) {
  Jewel.update(
    { code: jewel.code },
    {
      name: jewel.name,
      description: jewel.description,
      city: jewel.city,
      branch: jewel.branch,
      goldCarat: jewel.goldCarat,
      percentageChrg: jewel.percentageChrg,
      grossWeight: jewel.grossWeight,
      netWeight: jewel.netWeight,
      stoneWeight: jewel.stoneWeight,
      beadsWeight: jewel.beadsWeight,
      perGramWeight: jewel.perGramWeight,
      image: jewel.image,
    },
    callback
  );
};

module.exports.updateTap = function (jewel, callback) {
  Jewel.update(
    { code: jewel.code },
    { tap: jewel.tap + 1 },
    callback
  );
};

module.exports.updateSoldCount = function (jewel, callback) {
  Jewel.update(
    { code: jewel.code },
    { sold: jewel.sold + 1 },
    callback
  );
};