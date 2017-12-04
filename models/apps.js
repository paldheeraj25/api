var mongoose = require("mongoose");
var appDataSchema = mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  PartitionKey: {
    type: String,
    required: false
  },
  RowKey: {
    type: String,
    required: false
  },
  Timestamp: {
    type: String,
    required: false
  },
  CountRollingCodeError: {
    type: Number,
    required: false
  },
  CountRollingCodeOK: {
    type: Number,
    required: false
  },
  CountTimeStampError: {
    type: Number,
    required: false
  },
  LastCountRollingCodeError: {
    type: String,
    required: false
  },
  LastCountRollingCodeOK: {
    type: String,
    required: false
  },
  LastCountTimeStampError: {
    type: String,
    required: false
  },
  RollingCodeServer: {
    type: String,
    required: false
  },
  SecretKey: {
    type: String,
    required: false
  },
  TamperFlag: {
    type: String,
    required: false
  },
  TamperStatusOpened: {
    type: String,
    required: false
  },
  TimeStampServer: {
    type: Number,
    required: false
  }
});

var AppData = module.exports = mongoose.model('Apps', appDataSchema);
//get appData
module.exports.getAll = function (callback, limit) {
  AppData.find(callback).limit(limit);
};

module.exports.getOne = function (uid, callback) {
  AppData.findOne({ RowKey: uid }, callback);
};

module.exports.save = function (product, appData) {
  var AppData = new AppData(appData);
  AppData.save(callback);
};
