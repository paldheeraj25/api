var Insta = require('instamojo-nodejs');
Insta.setKeys('test_8ee3f513d3d06ec8e3de3149d11', 'test_c4dcc81e95a001669ee60a787fe');
Insta.isSandboxMode(true);

exports.Insta = function () {
  return Insta;
}