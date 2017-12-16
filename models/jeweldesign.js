var mongoose = require("mongoose");
var jeweldesignSchema = mongoose.Schema({
  name: {
    name: String,
    value: String,
    visibility: false
  },
  code: {
    name: String,
    value: String,
    visibility: false
  },
  description: {
    name: String,
    value: String,
    visibility: false
  },
  city: {
    name: String,
    value: String,
    visibility: false
  },
  branch: {
    name: String,
    value: String,
    visibility: false
  },
  goldCarat: {
    name: String,
    value: String,
    visibility: false
  },
  percentageChrg: {
    name: String,
    value: String,
    visibility: false
  },
  grossWeight: {
    name: String,
    value: String,
    visibility: false
  },
  netWeight: {
    name: String,
    value: String,
    visibility: false
  },
  stoneWeight: {
    name: String,
    value: String,
    visibility: false
  },
  beadsWeight: {
    name: String,
    value: String,
    visibility: false
  },
  perGramWeight: {
    name: String,
    value: String,
    visibility: false
  },
  image: {
    name: String,
    value: String,
    visibility: false
  },
  tap: {
    name: String,
    value: String,
    visibility: false
  },
  sold: {
    name: String,
    value: String,
    visibility: false
  }
});

var jeweldesign = module.exports = mongoose.model('jeweldesigns', jeweldesignSchema);
//get Jewels design
module.exports.getAll = function (callback, limit) {
  jeweldesign.find(callback);;
};

//get jewel design by id
module.exports.getOne = function (designId, callback) {
  jeweldesign.findOne({ _id: designId }, callback);
};

//save jewel design
module.exports.save = function (design, callback) {
  var design = new jeweldesign(design);
  design.save(callback);
};

// module.exports.updateOne = function (jewel, callback) {
//   Jewel.update(
//     { code: jewel.code },
//     {
//       name: jewel.name,
//       description: jewel.description,
//       city: jewel.city,
//       branch: jewel.branch,
//       goldCarat: jewel.goldCarat,
//       percentageChrg: jewel.percentageChrg,
//       grossWeight: jewel.grossWeight,
//       netWeight: jewel.netWeight,
//       stoneWeight: jewel.stoneWeight,
//       beadsWeight: jewel.beadsWeight,
//       perGramWeight: jewel.perGramWeight,
//       image: jewel.image,
//     },
//     callback
//   );
// };