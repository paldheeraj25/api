var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();
//intent
exports.validateUser = function (uid) {
  return new Promise((resolve, reject) => {
    let message;
    return firebase.database().ref('send_them_flowers/users/' + uid + '/user_type').once('value')
      .then(data => {
        return resolve(data.exists())
      }).catch(err => {
        return reject(false);
      });
  });
}
