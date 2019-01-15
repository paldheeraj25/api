// firebase
const firebase = require("firebase");
config = {
  apiKey: "AIzaSyDB6n9kZ8s26pqLaRFwoTacR4xTTTCZZk4",
  authDomain: "lakshmi-53afa.firebaseapp.com",
  databaseURL: "https://lakshmi-53afa.firebaseio.com",
  projectId: "lakshmi-53afa",
  storageBucket: "lakshmi-53afa.appspot.com",
  messagingSenderId: "1014878228303"
};
firebase.initializeApp(config);
exports.firebase = function () {
  return firebase;
}