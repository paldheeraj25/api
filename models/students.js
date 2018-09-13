var mongoose = require("mongoose");
var studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  year: {
    type: Number,
    required: false
  },
  grade: {
    type: String,
    required: false
  },
  active: {
    type: Boolean,
    required: false
  },
  phone: {
    type: Number,
    required: false
  }
});

var Students = module.exports = mongoose.model('students', studentSchema);

module.exports.getAll = function (callback, limit) {
  Students.find(callback).limit(limit);
};