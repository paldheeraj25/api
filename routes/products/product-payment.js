var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('../chatfuel/firebase');
var firebase = firebaseModule.firebase();

// import validator

// lodash
const _ = require('lodash');

// instamojo
var InstaModule = require('../chatfuel/Insta');
var Insta = InstaModule.Insta();

// axios: http request
const axios = require('axios');

router.post('/api/product/prepare-payment',
  function (req, res) {
    // messengerUserId
    const product = req.body;
    let orderObject = {};
    // Insta module object
    const data = new Insta.PaymentData();
    data.purpose = product.item + ' Shopping'; //req.body.purpose;
    data.amount = product.price.toString();
    data.buyer_name = product.name//req.body via database;
    data.redirect_url = 'https://paldheeraj25.github.io/';//req.body.redirect_url;
    data.email = product.email;//req.body.email;
    data.phone = product.phone;//req.body.phone;
    data.send_email = false;
    // data.webhook = 'http://pinnacle.lewiot.com:5012/api/instamojo/webhook';
    data.send_sms = false;
    data.allow_repeated_payments = false;
    orderObject.data = data;
    orderObject.cart = product;
    return makePayment(orderObject, function (response) {
      return res.send(response);
    });

  });

function makePayment(orderObject, callback) {
  Insta.createPayment(orderObject.data, (error, response) => {
    var responseJson = JSON.parse(response);
    let message;
    // todo: put a condition for wrong phone number
    // save the order object using payment id
    if (responseJson.success === false) {
      // TODO: redirect to change phone number block phone number error
      message = {
        "messages": [
          {
            "text": "Sorry Payment failed, Please provide valid phone number",
            "redirect_to_blocks": ["Phone Number"]
          }
        ]
      };
      return callback(message);
    } else {

      var databaseRef = firebase.database().ref("send_them_flowers/orders/" + responseJson.payment_request.id);
      databaseRef.set({
        address: orderObject.cart.address,
        amount: responseJson.payment_request.amount,
        delivery_status: "Not Delivered",
        order_detail: orderObject.cart,
        order_date: responseJson.payment_request.created_at,
        payment_status: 'pending',
        payment_type: "online",
        phone_number: responseJson.payment_request['phone'],
        user_id: responseJson.payment_request.buyer_name,
        payment_notify: "0"
      }, function (err) {
        if (err) {
          // The write failed...
          console.log('order data save failed');
          console.log(err);
        } else {
          // Data saved successfully!
          console.log('order recieved and saved succefully');
        }
      });
      return callback(responseJson);
    }
  });
}

// Cash on delivery
// todo: make this url more secure
router.get('/api/product/cash-on-delivery/',
  function (req, res) {
    // messengerUserId
    const paymentRequestId = req.query['id'];
    const messengerUserId = req.query['uid'];
    let message;
    return firebase.database().ref("send_them_flowers/orders/" + paymentRequestId).once("value")
      .then(function (snapshot) {
        if (snapshot.exists() && snapshot.val().user_id === messengerUserId) {
          firebase.database().ref("send_them_flowers/orders/" + paymentRequestId).update({
            "payment_type": "cash_on_delivery",
            "payment_notify": "1",
            "payment_status": "cash_on_delivery"
          }, function (err) {
            if (err) {
              // The write failed...
              console.log('order data save failed');
              console.log(err);
              message = {
                "messages": [
                  {
                    "text": "sorry store is unable to deliver cash on delivery right now."
                  }
                ]
              };
              return res.send(message);
            } else {
              // Data saved successfully!
              firebase.database().ref('send_them_flowers/users/' + messengerUserId).once('value').then((snapshot) => {
                firebase.database().ref('send_them_flowers/users/' + messengerUserId + '/order_history').push()
                  .set(paymentRequestId, function (err) {
                    if (err) {
                      // to-do: handle in future
                      console.log('order history data not set')
                    } else {
                      console.log('order added to order_history, now vacating cart');
                      firebase.database().ref('send_them_flowers/users/' + messengerUserId + '/cart').remove();
                      firebase.database().ref('send_them_flowers/users/' + messengerUserId + '/message').remove();
                    }
                  });
              });
              firebase.database().ref("send_them_flowers/orders/" + paymentRequestId).once('value').then(function (snapshot) {
                message = {
                  "set_attributes":
                  {
                    "payment_tracking_id": paymentRequestId,
                    "order_amount": snapshot.val().amount
                  },
                  "redirect_to_blocks": ["Cash On Delivery"]
                }
                return res.send(message);
              });
            }
          });
        } else {
          message = {
            "messages": [
              {
                "text": "sorry payment request for cash on delivery in invalid."
              }
            ]
          };
          return res.send(message);
        }

      });
  })


// router.get('/api/chatfuel/refresh',
//   function (req, res) {
//     // messengerUserId
//     const messengerUserId = req.query['messenger user id'];
//     firebase.database().ref('send_them_flowers/users/2126625100757576/order_history').remove();
//     firebase.database().ref('send_them_flowers/users/2126625100757576/cart').remove();
//     firebase.database().ref('send_them_flowers/orders/').remove();
//     res.send('data removed');
//   });

module.exports = router;
