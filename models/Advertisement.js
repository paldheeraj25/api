var mongoose = require("mongoose");
var AdvertisementSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String
});

var Ad = module.exports = mongoose.model('advertisements', AdvertisementSchema);
//get ad
module.exports.getAd = function (callback) {
  Ad.find(callback).sort({ field: 'asc', _id: -1 }).limit(1);
};

//save ad
module.exports.save = function (ad, callback) {
  console.log(ad);
  var Advertisement = new Ad(ad);
  Advertisement.save(callback);
};