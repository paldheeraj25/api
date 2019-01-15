var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();
//

router.get('/api/chatfuel/user/validate',
  function (req, res) {
    // messengerUserId
    const messagengeruserId = req.query["messenger user id"];
    const chatfuelApiKey = req.query["stf_api_key"];
    let messageResponse;
    // if the key matches add the user other wise no
    // TODO: keep it in const later.
    if (chatfuelApiKey === "send_them_flowers_4594043041") {
      return firebase.database().ref("send_them_flowers/users/" + messagengeruserId).update({ "user_type": "bot" }).then(function (data) {
        messageResponse = {
          "set_attributes":
          {
            "user_type": "bot",
          }
        };
        return res.send(messageResponse);
      }).catch(err => {
        messageResponse = {
          "messages": [
            { "text": "Sorry some error occured" },
          ]
        }
        return res.send(messageResponse);
      });

      return res.send();
    } else {
      messageResponse = {
        "messages": [
          { "text": "sorry invalide messenger user" },
        ]
      }
      return res.send(messageResponse);
    }
  });

module.exports = router;
