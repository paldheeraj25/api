var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();
// jwt token
var jwt = require('jsonwebtoken');

router.post('/api/chatfuel/user/validate',
  function (req, res) {
    // messengerUserId
    const messegenrUserId = req.body["messenger user id"];
    const chatfuelApiKey = req.body["stf_api_key"];
    let messageResponse;
    // if the key matches add the user other wise no
    // TODO: keep it in const later.
    if (chatfuelApiKey === "send_them_flowers_4594043041") {
      const user = {
        id: messegenrUserId,
        user_type: "bot"
      }
      return firebase.database().ref("send_them_flowers/users/" + messegenrUserId).update({ "user_type": "bot" }).then(function (data) {
        return jwt.sign({ user: user }, '', (err, token) => {
          if (err) {
            return res.send(err)
          } else {
            //firebase.database().ref("send_them_flowers/users/" + messagengeruserId).update({ "user_type": "bot" });
            messageResponse = {
              "set_attributes":
              {
                "stf_api_token": token,
              }
            };
            return res.send(messageResponse);
          }
        });
      }).catch(err => {
        messageResponse = {
          "messages": [
            { "text": "Sorry some error occured" },
          ]
        }
        return res.send(messageResponse);
      });
    }
  });

module.exports = router;
