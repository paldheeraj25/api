var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();

// lodash
const _ = require('lodash');

router.get('/api/chatfuel/user/cart',
  function (req, res) {
    // messengerUserId
    let message;
    const messagengeruserId = req.query["messenger user id"];
    return firebase.database().ref('send_them_flowers/users/' + messagengeruserId + "/cart").once('value')
      .then(function (snapshot) {
        let cart;
        if (_.size(snapshot.val()) == null || _.size(snapshot.val()) == 0) {
          cart = {
            "messages": [
              {
                "text": "you cart 🛒 is empty!"
              }
            ]
          };
        } else {
          let cartElements = _.map(snapshot.val(), function (item) {
            return {
              "title": item.name,
              "image_url": item.image,
              "subtitle": "price: " + item.price,
              "buttons": [
                {
                  "url": "http://pinnacle.lewiot.com:5012/api/chatfuel/cart/remove?id=" + item.id + "&uid=" + messagengeruserId,
                  "type": "json_plugin_url",
                  "title": "Remove This"
                },
                {
                  "type": "web_url",
                  "url": "https://dry-plateau-78185.herokuapp.com/#/flower/details?flowerId=" + item.id,
                  "title": "View Item"
                }
              ]
            };
          });

          cart = {
            "messages": [
              {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "image_aspect_ratio": "square",
                    "elements": cartElements
                  }
                }
              }
            ]
          };
        };
        return res.send(cart);
      }).catch(function (err) {
        console.log(err);
      });
  });

router.get('/api/chatfuel/cart/remove',
  function (req, res) {
    // messengerUserId
    let message;
    let removedItem;
    const messagengeruserId = req.query["uid"];
    const itemId = req.query["id"];
    return firebase.database().ref('send_them_flowers/users/' + messagengeruserId + "/cart").once('value')
      .then(function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          if (childSnapshot.val().id == itemId) {
            removedItem = childSnapshot.val().name;
            firebase.database().ref('send_them_flowers/users/' + messagengeruserId + "/cart/" + childSnapshot.key).remove();
          };
        });
        const message = {
          "messages": [
            {
              "text": removedItem + " has been removed from the cart."
            },
          ]
        };
        res.send(message);
      }).catch(function (err) {
        console.log(err);
      });
  });


router.get('/api/chatfuel/cart/message',
  function (req, res) {
    // messengerUserId
    const message = req.query["message"];
    const messagengeruserId = req.query["messenger user id"];
    let resposeMessage;
    firebase.database().ref('send_them_flowers/users/' + messagengeruserId).update({ message: message }, function (err) {
      if (err) {
        console.log('message cant be updated');
        resposeMessage = {
          "messages": [
            {
              "text": "Sorry message cant be added at this moment"
            }
          ]
        };
      } else {
        console.log('message update successfull');
        resposeMessage = {
          "messages": [
            {
              "text": "sure I will keep personal message 📝 as '"
                + message + "' on the order."
            },
          ]
        };
      }
      return res.send(resposeMessage);
    });

  });


router.get('/api/chatfuel/cart/check',
  function (req, res) {
    // messengerUserId
    const messagengeruserId = req.query["messenger user id"];
    firebase.database().ref('send_them_flowers/users/' + messagengeruserId + "/cart").once('value')
      .then(function (snapshot) {
        let isCartEmpty;
        let message;
        if (snapshot.val()) {
          isCartEmpty = null;
        } else {
          isCartEmpty = 'yes'
        }

        message = {
          "set_attributes": {
            "isCartEmpty": isCartEmpty
          }
        };

        return res.send(message);
      });
  });


router.get('/api/chatfuel/cart/total',
  function (req, res) {
    // messengerUserId
    const messagengeruserId = req.query["messenger user id"];
    firebase.database().ref('send_them_flowers/users/' + messagengeruserId + "/cart").once('value')
      .then(function (snapshot) {
        let cartPrice = 0;
        _.forEach(snapshot.val(), function (cartItem) {
          cartPrice = cartPrice + cartItem.price;
        });
        const message = {
          "set_attributes": {
            "cart_price": cartPrice
          }
        };
        return res.send(message);
      });
  });

module.exports = router;
