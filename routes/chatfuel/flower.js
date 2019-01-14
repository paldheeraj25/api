var express = require('express'), router = express.Router();
// lodash
const _ = require('lodash');

//firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();

router.get('/api/chatfuel/flower/list',
  function (req, res) {
    // pagination
    let paginationId = req.query['pagination_id'];
    const limit = 10;
    // first time user
    if (paginationId === undefined || paginationId === null || paginationId == '0' || paginationId == 0) {
      return firebase.database().ref('send_them_flowers/flowers').orderByKey().limitToFirst(limit).once('value').then(function (snapshot) {
        return flowerListResponse(snapshot).then(function (resMessageResponse) {
          res.send(resMessageResponse);
        });
      });
    } else {
      return firebase.database().ref('send_them_flowers/flowers').orderByKey().startAt(paginationId).limitToFirst(limit).once('value').then(function (snapshot) {
        return flowerListResponse(snapshot).then(function (resMessageResponse) {
          res.send(resMessageResponse);
        });
      });
    }
  });

// flowerListReponse
function flowerListResponse(snapshot) {
  let flower;
  let flowers = [];
  let next;
  // pagination
  let paginationIdArray = []
  snapshot.forEach(function (childSnapshot) {
    flower = {
      "title": childSnapshot.val().name,
      "image_url": childSnapshot.val().image,
      "subtitle": "price: " + childSnapshot.val().price + " Rs.",
      "buttons": [
        {
          "url": "https://dry-plateau-78185.herokuapp.com/api/chatfuel/flower/select?flowerId=" + childSnapshot.key,
          "type": "json_plugin_url",
          "title": "Buy This"
        },
        {
          "type": "web_url",
          "url": "https://dry-plateau-78185.herokuapp.com/#/flower/details?flowerId=" + childSnapshot.key,
          "title": "View Item"
        }
      ]
    }
    flowers.push(flower);
    paginationIdArray.push(childSnapshot.key);
  });
  next = _.last(paginationIdArray);
  paginationIdArray = [];
  return firebase.database().ref('send_them_flowers/flowers').orderByKey().endAt(next).once('value').then(function (dataSnapshot) {
    paginationIdArray = [];
    dataSnapshot.forEach(function (childDataSnapshot) {
      paginationIdArray.push(childDataSnapshot.key);
    });
    return {
      "messages": [
        {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "image_aspect_ratio": "square",
              "elements": flowers
            }
          },
          "quick_replies": [
            {
              "title": "<<",
              "set_attributes": {
                "pagination_id": 0
              }
            },
            {
              "title": "<",
              "set_attributes": {
                "pagination_id": _.head(_.takeRight(paginationIdArray, 20))
              }
            },
            {
              "title": ">",
              "set_attributes": {
                "pagination_id": _.last(_.takeRight(paginationIdArray, 20))
              }
            },
            {
              "title": "Checkout",
              "block_names": ["Empty Cart Check"]
            },
            {
              "title": "Cart 🛒",
              "block_names": ["Cart"]
            }
          ]
        }

      ]
    };
  });
}
router.get('/api/chatfuel/flower/select',
  function (req, res) {
    // messengerUserId
    const messagengeruserId = req.query['messenger user id'];
    const flowerId = req.query['flowerId'];
    let message;
    // push selection in the user cart
    // firebase.database().ref('send_them_flowers/users/cart' + messagengeruserId).push();
    return firebase.database().ref('send_them_flowers/flowers/' + flowerId).once('value').then(snapshot => {
      const flowerSnapshot = snapshot.val();
      message = {
        "messages": [
          {
            "text": "Superb! 👏🏻 " + flowerSnapshot.name + " is great choice 🌹 and added to cart 🛒 🛍️",
            "quick_replies": [
              {
                "title": "Continue shoping",
                "block_names": ["Flowers"]
              },
              {
                "title": "Checkout",
                "block_names": ["Empty Cart Check"]
              },
              {
                "title": "Cart 🛒",
                "block_names": ["Cart"]
              }
            ]
          },
        ]
      };
      flowerSnapshot.id = flowerId;
      firebase.database().ref('send_them_flowers/users/' + messagengeruserId + '/cart').push().set(flowerSnapshot);
      return res.send(message);
    }).catch(err => {
      message = {
        "messages": [
          { "text": "sorry selection is not available" },
        ]
      };
      return res.send(err);
    });
  });

router.get('/api/chatfuel/user/address',
  function (req, res) {
    // messengerUserId
    let message;
    const address = {
      "before_address": req.query["before_address"],
      "city_address": req.query["city_address"],
      "after_address": req.query["after_address"]
    };

    const messagengeruserId = req.query["messenger user id"];
    return firebase.database().ref('send_them_flowers/users/' + messagengeruserId).update({ address },
      function (error) {
        if (error) {
          // The write failed...
          message = {
            "messages": [
              {
                "text": "there was an error",
              },
            ]
          };
          return res.send(message);
        } else {
          // Data saved successfully!
          message = {
            "messages": [
              { "text": "I noted down your 🏠 address!!" },
            ]
          };
          return res.send(message);
        }
      });

  });

router.get('/api/chatfuel/user/parcelname',
  function (req, res) {
    // messengerUserId
    let message;
    const messagengeruserId = req.query["messenger user id"];
    return firebase.database().ref('send_them_flowers/users/' + messagengeruserId).update({ name: req.query['parcel_name'] },
      function (error) {
        if (error) {
          // The write failed...
          message = {
            "messages": [
              {
                "text": "there was an error",
              },
            ]
          };
          return res.send(message);
        } else {
          // Data saved successfully!
          message = {
            "messages": [
              { "text": "great! I noted 📝 " }
            ]
          }// after_address
          return res.send(message);
        }
      });

  });

router.get('/api/chatfuel/user/phone-email',
  function (req, res) {
    // messengerUserId
    console.log(req.query);
    let message;
    const phone = req.query['user_phone'];
    const messagengeruserId = req.query["messenger user id"];
    return firebase.database().ref('send_them_flowers/users/' + messagengeruserId).update({ phone: phone },
      function (error) {
        if (error) {
          // The write failed...
          message = {
            "messages": [
              {
                "text": "there was an error",
              },
            ]
          };
          return res.send(message);
        } else {
          // Data saved successfully!
          message = {
            "messages": [
              { "text": "Delivery 🚚 details are ready:" }
            ]
          };
          return res.send(message);
        }
      });

  });



router.post('/api/chatfuel/flower/dashboard/upload',
  function (req, res) {
    // messengerUserId
    console.log(req.query);
    const flower = req.body;
    flower['image-collection'] = flower.gallery;
    const messagengeruserId = req.query["messenger user id"];
    return firebase.database().ref('send_them_flowers/flowers/').push().set(flower,
      function (error) {
        if (error) {
          return res.send('flower upload unsuccessful');
        } else {
          // Data saved successfully!
          message = flower;
          return res.send(message);
        }
      });

  });

router.get('/api/dashboard/flower/list',
  function (req, res) {
    // messengerUserId
    let flowers = [];
    let flower;
    return firebase.database().ref('send_them_flowers/flowers').once('value').then(snapshot => {
      snapshot.forEach(function (childSnapshot) {
        flower = childSnapshot.val();
        flower.id = childSnapshot.key;
        flowers.push(flower);
      });
      return res.send(flowers);
    })
  });

router.get('/api/dashboard/flower/orders',
  function (req, res) {
    // messengerUserId
    let orders = [];
    let order;
    return firebase.database().ref('send_them_flowers/orders').once('value').then(snapshot => {
      snapshot.forEach(function (childSnapshot) {
        order = childSnapshot.val();
        order.id = childSnapshot.key;
        orders.push(order);
      });
      return res.send(orders);
    })
  });

router.get('/api/dashboard/flower/select',
  function (req, res) {
    // messengerUserId
    let flowerId = req.query['id']
    return firebase.database().ref('send_them_flowers/flowers/' + flowerId).once('value').then(snapshot => {
      return res.send(snapshot.val());
    })
  });

router.post('/api/dashboard/flower/select/edit/:id',
  function (req, res) {
    // messengerUserId
    console.log(req.body)
    let flowerId = req.params.id;
    let flower = req.body
    return firebase.database().ref('send_them_flowers/flowers/' + flowerId).update(flower).then(data => {
      return res.send({ "status": "success" });
    }).catch(err => {
      console.log(err);
      return res.send(err);
    })
  });


module.exports = router;
