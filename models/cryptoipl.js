var mongoose = require("mongoose");
var cryptoiplSchema = mongoose.Schema({
  wallet: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  }
});

var Cryptoipl = module.exports = mongoose.model('participants', cryptoiplSchema);

module.exports.getAll = function (callback, limit) {
  Cryptoipl.find(callback).limit(limit);
};

module.exports.getOne = function (wallet, callback) {
  Cryptoipl.findOne({wallet: wallet }, callback);
}

module.exports.saveinfo = function (team, callback) {
  Cryptoipl.create(team, callback);
}

module.exports.updateinfo = function(team, callback) {
  Cryptoipl.update(
    { _id: team._id },
    {
      email: team.email,
      wallet: team.wallet
    },
    callback
  );
}