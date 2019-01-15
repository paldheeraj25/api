// firebase
const firebase = require("firebase");
config = {

};
firebase.initializeApp(config);
exports.firebase = function () {
  return firebase;
}