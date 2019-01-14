var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();

// lodash
const _ = require('lodash');

router.get('/api/chatfuel/order-reciept',
  function (req, res) {
    // messengerUserId
    const orderId = req.query["payment_tracking_id"];
    firebase.database().ref("send_them_flowers/orders/" + orderId).once('value').then(function (snapshot) {
      const orderDetail = snapshot.val();
      let elements = _.map(orderDetail.order_detail.cart, function (item) {
        return {
          "title": item.name,
          "subtitle": "Send Them Flowers",
          "quantity": 1,
          "price": item.price,
          "currency": "INR",
          "image_url": item.image
        }
      });
      //return res.send(elements);
      let message = {
        "messages": [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "receipt",
                "recipient_name": snapshot.val().order_detail.name,
                "order_number": orderId,
                "currency": "INR",
                "payment_method": snapshot.val().payment_type,
                "order_url": "https://rockets.chatfuel.com/store?order_id=12345678901",
                "timestamp": (new Date().getTime().toString()).substring(0, 10),
                "address": {
                  "street_1": ": " + orderDetail.order_detail.address.before_address,
                  "street_2": ", " + orderDetail.order_detail.address.after_address,
                  "city": orderDetail.order_detail.address.city_address,
                  "postal_code": "ipc",
                  "state": "india",
                  "country": "INDIA"
                },
                "summary": {
                  "subtotal": snapshot.val().amount - (snapshot.val().amount * 0.2),
                  "shipping_cost": snapshot.val().amount * 0.1,
                  "total_tax": snapshot.val().amount * 0.1,
                  "total_cost": snapshot.val().amount
                },
                "adjustments": [
                  {
                    "name": "Send Them Flower Coupon",
                    "amount": 0
                  }
                ],
                "elements": elements
              }
            }
          }
        ]
      }
      return res.send(message);
    });

  });

module.exports = router;
