var express = require('express'), router = express.Router();
//firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();

// lodash
const _ = require('lodash');

// instamojo
var InstaModule = require('./Insta');
var Insta = InstaModule.Insta();

// axios: http request
const axios = require('axios');

router.get('/api/chatfuel/prepare-payment',
  function (req, res) {
    // messengerUserId
    const messengerUserId = req.query['messenger user id'];
    let cartPrice = 0;
    // get the user to prepare order
    firebase.database().ref('send_them_flowers/users/' + messengerUserId).once('value').then(snapshot => {

      _.forEach(snapshot.val().cart, function (cartItem) {
        cartPrice = cartPrice + cartItem.price;
      });
      let orderObject = {};
      // Insta module object
      const data = new Insta.PaymentData();
      data.purpose = 'Send Them Flowers Shopping'; //req.body.purpose;
      data.amount = '9';//cartPrice;//req.body.amount;
      data.buyer_name = messengerUserId//req.body via database;
      data.redirect_url = 'https://paldheeraj25.github.io/';//req.body.redirect_url;
      data.email = 'paldheeraj25@gmail.com';//req.body.email;
      data.phone = snapshot.val().phone;//req.body.phone;
      data.send_email = false;
      data.webhook = 'http://pinnacle.lewiot.com:5012/api/instamojo/webhook';
      data.send_sms = false;
      data.allow_repeated_payments = false;
      orderObject.data = data;
      orderObject.userInfo = snapshot.val();
      return makePayment(orderObject, function (response) {
        return res.send(response);
      });
    }).catch(err => {
      return res.send(err)
    });
  });

function makePayment(orderObject, callback) {
  Insta.createPayment(orderObject.data, (error, response) => {
    var responseJson = JSON.parse(response);
    let message;
    // todo: put a condition for wrong phone number
    // save the order object using payment id
    console.log(responseJson.success)
    if (responseJson.success === false) {
      message = {
        "messages": [
          {
            "text": "Sorry Payment failed",
          }
        ]
      };
      return callback(message);
    } else {

      var databaseRef = firebase.database().ref("send_them_flowers/orders/" + responseJson.payment_request.id);
      databaseRef.set({
        address: orderObject.userInfo.address.before_address + ' ' + orderObject.userInfo.address.city_address,
        amount: responseJson.payment_request.amount,
        delivery_status: "Not Delivered",
        order_detail: orderObject.userInfo,
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
      // messenger response object
      let items = "";
      _.forEach(orderObject.userInfo.cart, function (item) {
        items = item.name + ", " + items;
      });
      let responseObject = {
        "messages": [
          {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "image_aspect_ratio": "square",
                "elements": [
                  {
                    "title": "Total: " + responseJson.payment_request.amount + " Rs. " + items,
                    "image_url": _.find(orderObject.userInfo.cart).image,
                    "subtitle": orderObject.userInfo.name + ", Address "
                      + orderObject.userInfo.address.before_address + " " + orderObject.userInfo.address.city_address
                      + " " + orderObject.userInfo.phone + ".",
                    "buttons": [
                      {
                        "url": responseJson.payment_request.longurl,
                        "type": "web_url",
                        "title": "Pay Online"
                      },
                      {
                        "url": "http://pinnacle.lewiot.com:5012/api/chatfuel/cash-on-delivery?id=" + responseJson.payment_request.id + "&uid=" + responseJson.payment_request.buyer_name,
                        "type": "json_plugin_url",
                        "title": "Cash On Delivery"
                      },
                    ]
                  }
                ]
              }
            }
          }
        ]
      };
      return callback(responseObject);
    }
  });
}

// Cash on delivery
// todo: make this url more secure
router.get('/api/chatfuel/cash-on-delivery/',
  function (req, res) {
    // messengerUserId
    const paymentRequestId = req.query['id'];
    const messengerUserId = req.query['uid'];
    let message;
    firebase.database().ref("send_them_flowers/orders/" + paymentRequestId).once("value")
      .then(function (snapshot) {
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
      });
  })


router.post('/api/instamojo/webhook',
  function (req, res) {

    var paymentStatus = req.body
    var chatfuelUrl;
    let payment_type = "online";
    let payment_status;
    if (paymentStatus.status === 'Credit') {
      chatfuelUrl = "https://api.chatfuel.com/bots/5c3b77ca76ccbc01c2c4abc0/users/" + paymentStatus.buyer_name + "/send?chatfuel_token=bNxRvihbjPJZTYygDNdb9EyWbC6CMGvQFmSfVNEgZoSTMFFZUW3y8k8ObWvbh5sC&chatfuel_message_tag=PAYMENT_UPDATE&chatfuel_block_name=PaymentSuccessNotification";
      console.log('this is chatfuel url');
      console.log(chatfuelUrl);
      payment_status = "online_success";
      // here create and save the order
      var orderObject = {};
      orderObject.address =
        responseText = "Your payment of rupess " + paymentStatus.amount + " was successful with payment for "
        + paymentStatus.purpose + " you can track your order with "
        + paymentStatus.payment_id;
      firebase.database().ref('send_them_flowers/orders/' + paymentStatus.payment_request_id).once('value')
        .then(function (snapshot) {
          if (snapshot.val().payment_notify == '0' || snapshot.val().payment_status == "online_failed") {
            firebase.database().ref('send_them_flowers/users/' + paymentStatus.buyer_name).once('value').then((snapshot) => {
              firebase.database().ref('send_them_flowers/users/' + paymentStatus.buyer_name + '/order_history').push()
                .set(paymentStatus.payment_request_id, function (err) {
                  if (err) {
                    console.log('order history data not set')
                  } else {
                    console.log('order added to order_history, now vacating cart');
                    firebase.database().ref('send_them_flowers/users/' + paymentStatus.buyer_name + '/cart').remove();
                    firebase.database().ref('send_them_flowers/users/' + paymentStatus.buyer_name + '/message').remove();
                  }
                });
            });
          }
        });
    } else {
      payment_status = "online_failed";
      firebase.database().ref('send_them_flowers/orders/' + paymentStatus.payment_request_id)
        .once('value').then(function (snapshot) {
          if (snapshot.val().payment_type == "online") {
            chatfuelUrl = "https://api.chatfuel.com/bots/5c3b77ca76ccbc01c2c4abc0/users/" + paymentStatus.buyer_name + "/send?chatfuel_token=bNxRvihbjPJZTYygDNdb9EyWbC6CMGvQFmSfVNEgZoSTMFFZUW3y8k8ObWvbh5sC&chatfuel_message_tag=PAYMENT_UPDATE&chatfuel_block_name=PaymentFailNotification";
          }
        });
    }

    var paymentRequestId = paymentStatus.payment_request_id;
    firebase.database().ref('send_them_flowers/orders/' + paymentRequestId).once('value').then(function (snapshot) {
      console.log('updating order payment_id after payment');
      var orderObject = snapshot.val();
      if (orderObject.payment_notify == "0") {
        console.log('entered in webhook');
        firebase.database().ref('send_them_flowers/orders/' + paymentRequestId).update({ payment_notify: "1", payment_id: paymentStatus.payment_id, payment_status: payment_status },
          function (err) {
            if (err) {
              console.log('order payment_id could not be updated');
            } else {
              console.log('data updated successfuly and sending notification to user.')
              axios.post(chatfuelUrl,
                {
                  "payment_status": paymentStatus.status || "",
                  "payment_amount": paymentStatus.amount || "",
                  "payment_tracking_id": paymentStatus.payment_request_id || ""
                })
                .then((res) => {
                  console.log('payment notification sent');
                  // console.log(res)
                })
                .catch((error) => {
                  console.error(error)
                  console.log('could not notify user.');
                })
            }
          });
      }
    }).catch(function (err1) {
      console.log(err1)
    });
  });
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
