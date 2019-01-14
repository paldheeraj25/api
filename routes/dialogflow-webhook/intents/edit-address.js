//firebase
var firebaseModule = require('../../chatfuel/firebase');
var firebase = firebaseModule.firebase();
//flowers database
exports.editAddress = function (fulfillment) {
  return new Promise((resolve, reject) => {
    return firebase.database().ref('send_them_flowers/flowers').once('value').then(snapshot => {
      return resolve(snapshot.val());
    }).catch(err => {
      return reject(err);
    });
  })
}