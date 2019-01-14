var Insta = require('instamojo-nodejs');

Insta.isSandboxMode(true);

exports.Insta = function () {
  return Insta;
}