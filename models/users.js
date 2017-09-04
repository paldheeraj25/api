var mongoose = require("mongoose");
var productSchema = mongoose.Schema({
  username: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  }
});

var Users = module.exports = mongoose.model('users', productSchema);

module.exports.getOne = function (user, callback) {
  Users.findOne({ email: user.email }, callback);
}

module.exports.addUser = function (user, callback) {
  if (!Users.getOne(user)) {
    Users.create(user, callback);
  } else {
    Users.getOne(user, callback);
  }
}

