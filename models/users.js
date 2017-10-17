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
  },
  role: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    required: false
  }
});

var Users = module.exports = mongoose.model('users', productSchema);

module.exports.getAll = function (callback, limit) {
  Users.find(callback).limit(limit);
};

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

module.exports.delete = function(user, callback) {
  console.log(user);
  Users.remove(user, callback);
}