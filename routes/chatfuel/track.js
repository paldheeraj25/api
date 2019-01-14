var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();

// lodash
const _ = require('lodash');

router.get('/api/chatfuel/order/track/list',
  function (req, res) {
    // messengerUserId
    let message;
    const messengerId = req.query["messenger user id"];
    firebase.database().ref("send_them_flowers/users/" + messengerId + "/order_history").once('value').then(function (snapshot) {
      let ordersCount = 1;
      let ordersArray = [];
      if (snapshot.val()) {
        snapshot.forEach(function (chileSnapshot) {
          let orderIdSet = {
            "title": "order " + ordersCount,
            "set_attributes": {
              "order_id": chileSnapshot.val()
            }
          }
          ordersArray.push(orderIdSet);
          ordersCount++;
        });
        // setting message
        message = {
          "messages": [
            {
              "text": "here I 😊 found them..",
              "quick_replies": ordersArray
            }
          ]
        }
        // message setting ends
      } else {
        message = {
          "messages": [
            {
              "text": "sorry can't find any orders to track!",
              "quick_replies": [
                {
                  "title": "Keep Shopping",
                  "block_names": ["Flowers"]
                }
              ]
            }
          ]
        }
      }

      return res.send(message);
    })
  });


router.get('/api/chatfuel/order/track/details',
  function (req, res) {
    // messengerUserId
    let message;
    const orderId = req.query["order_id"];
    firebase.database().ref("send_them_flowers/orders/" + orderId + "/order_detail/cart").once('value').then(function (snapshot) {
      let orderItems = [];
      let orderDetail;
      snapshot.forEach(function (childSnapshot) {
        orderDetail = {
          "title": childSnapshot.val().name,
          "image_url": childSnapshot.val().image,
          "subtitle": "",
        }
        orderItems.push(orderDetail);
      });
      message = {
        "messages": [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "image_aspect_ratio": "square",
                "elements": orderItems
              }
            }
          }
        ]
      }
      return res.send(message);
    })
  });

router.get('/api/chatfuel/order/track/status',
  function (req, res) {
    // messengerUserId
    let message;
    const orderId = req.query["order_id"];
    firebase.database().ref("send_them_flowers/orders/" + orderId).once('value').then(function (snapshot) {
      let message = {
        "set_attributes":
        {
          "order_track_status": snapshot.val().delivery_status
        }
      }

      return res.send(message);
    }).catch(function (error) {
      console.log(err);
    })
  });

router.get('/api/chatfuel/order/track/cancel',
  function (req, res) {
    console.log(req.query);
    const orderId = req.query['order_id'];
    firebase.database().ref("/send_them_flowers/orders/" + orderId).update({ "delivery_status": "cancelled" }, function (err) {
      console.log('order cancelled with Id ' + orderId);
      if (err) {

      } else {
        const message = {
          "messages": [
            {
              "text": "Order cancelled succefully",
            }
          ]
        };
        res.send(message);
      }
    });
  });

module.exports = router;
