var express = require('express'), router = express.Router();
// lodash
const _ = require('lodash');
// strike
var strikeThroughText = require('strikethrough');
// firebase
var firebaseModule = require('./firebase');
var firebase = firebaseModule.firebase();
// user-validatore
var validateUsermodule = require('./validate-user');
const personTypes = {
  "gf or bf": "gfBf",
  "wife or husband": "wifeHusband",
  "mom or dad": "momDad",
  "best or close friend": "bestFriend",
  "friend or relative": "friendRelative",
  "others": "friendRelative"
}

router.get('/api/chatfuel/flower/list',
  function (req, res) {
    // pagination
    let paginationId = req.query['pagination_id'];
    const messengerUserId = req.query['messenger user id'];
    const limit = 10;
    // person_type check
    const personType = personTypes[req.query['person_type']];

    // first time user
    if (paginationId === undefined || paginationId === null || paginationId == '0' || paginationId == 0) {
      return firebase.database().ref('send_them_flowers/person/' + personType).orderByKey().limitToFirst(limit).once('value').then(function (snapshot) {
        return flowerListResponse(snapshot, personType).then(function (resMessageResponse) {
          res.send(resMessageResponse);
        });
      });
    } else {
      return firebase.database().ref('send_them_flowers/person/' + personType).orderByKey().startAt(paginationId).limitToFirst(limit).once('value').then(function (snapshot) {
        return flowerListResponse(snapshot, personType).then(function (resMessageResponse) {
          res.send(resMessageResponse);
        });
      });
    }
  });

// flowerListReponse
function flowerListResponse(snapshot, personType) {
  let flower;
  let flowers = [];
  let next;
  // pagination
  let paginationIdArray = []
  snapshot.forEach(function (childSnapshot) {
    flower = {
      "title": childSnapshot.val().name,
      "image_url": childSnapshot.val().image,
      "subtitle": "Rs: " + strikeThroughText(childSnapshot.val().price.toString()),
      "buttons": [
        {
          "url": "http://pinnacle.lewiot.com:5012/api/chatfuel/flower/select?flowerId=" + childSnapshot.key,
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
  return firebase.database().ref('send_them_flowers/person/' + personType).orderByKey().endAt(next).once('value').then(function (dataSnapshot) {
    paginationIdArray = [];
    dataSnapshot.forEach(function (childDataSnapshot) {
      paginationIdArray.push(childDataSnapshot.key);
    });
    console.log(_.head(_.takeRight(paginationIdArray, 20)));
    console.log(_.last(_.takeRight(paginationIdArray, 20)));
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
    const messengerUserId = req.query['messenger user id'];
    const flowerId = req.query['flowerId'];
    const personType = personTypes[req.query['person_type']];
    let message;
    // push selection in the user cart
    return firebase.database().ref('send_them_flowers/users/' + messengerUserId).once('value')
      .then(user => {
        if (user.exists()) {
          return firebase.database().ref('send_them_flowers/person/' + personType + '/' + flowerId).once('value').then(snapshot => {
            const flowerSnapshot = snapshot.val();
            message = {
              "messages": [
                {
                  "text": "Superb! 👏🏻 " + flowerSnapshot.name + " is great choice 🌹 and added to cart 🛒 🛍️",
                  "quick_replies": [
                    {
                      "title": "Keep shoping",
                      "block_names": ["start person type"]
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
            firebase.database().ref('send_them_flowers/users/' + messengerUserId + '/cart').push().set(flowerSnapshot);
            return res.send(message);
          }).catch(err => {
            console.log(err);
            message = {
              "messages": [
                { "text": "sorry selection is not available" },
              ]
            };
            return res.send(message);
          });
        } else {
          message = {
            "messages": [
              {
                "text": "invalid user",
              },
            ]
          };
          return res.send(message);
        }
      })
      .catch(err => {
        message = {
          "messages": [
            {
              "text": "invalid user or flower",
            },
          ]
        };
        return res.send(message);
      });
  });

router.post('/api/chatfuel/user/address', validateUsermodule.validateUser,
  function (req, res) {
    // messengerUserId
    let message;
    const address = {
      "before_address": req.body["before_address"],
      "city_address": req.body["city_address"],
      "after_address": req.body["after_address"]
    };
    const messengerUserId = req.body.authData.user.id;
    return firebase.database().ref('send_them_flowers/users/' + messengerUserId).update({ address },
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

router.post('/api/chatfuel/user/parcelname', validateUsermodule.validateUser,
  function (req, res) {
    // messengerUserId
    let message;
    const messengerUserId = req.body.authData.user.id;
    return firebase.database().ref('send_them_flowers/users/' + messengerUserId).update({ name: req.body['parcel_name'] },
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

router.post('/api/chatfuel/user/phone-email', validateUsermodule.validateUser,
  function (req, res) {
    // messengerUserId
    let message;
    const phone = req.body['user_phone'];
    const messengerUserId = req.body.authData.user.id;
    return firebase.database().ref('send_them_flowers/users/' + messengerUserId).update({ phone: phone },
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
    const flower = req.body;
    flower['image-collection'] = flower.gallery;
    let dataRef;
    if (flower.person != "null") {
      dataRef = firebase.database().ref('send_them_flowers/person/' + flower.person);
    } else {
      dataRef = firebase.database().ref('send_them_flowers/flowers/');
    }

    return dataRef.push().set(flower,
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
    const person = req.query['person'];
    let dataRef;
    if (person == 'null' || person == undefined) {
      dataRef = firebase.database().ref('send_them_flowers/flowers');
    } else {
      dataRef = firebase.database().ref('send_them_flowers/person/' + person);
    }
    return dataRef.once('value').then(snapshot => {
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
    let flowerId = req.query['id'];
    const person = req.query['person'];
    let dataRef;
    if (person == 'null' || person == undefined) {
      dataRef = firebase.database().ref('send_them_flowers/flowers/' + flowerId);
    } else {
      dataRef = firebase.database().ref('send_them_flowers/person/' + person + '/' + flowerId);
    }
    return dataRef.once('value').then(snapshot => {
      return res.send(snapshot.val());
    })
  });

router.post('/api/dashboard/flower/select/edit/:id',
  function (req, res) {
    // messengerUserId
    let flowerId = req.params.id;
    let flower = req.body.flower;
    const person = req.body.person;
    let dataRef;
    if (person == 'null' || person == undefined) {
      dataRef = firebase.database().ref('send_them_flowers/flowers/' + flowerId);
    } else {
      dataRef = firebase.database().ref('send_them_flowers/person/' + person + '/' + flowerId);
    }
    return dataRef.update(flower).then(data => {
      return res.send({ "status": "success" });
    }).catch(err => {
      console.log(err);
      return res.send(err);
    });
  });


module.exports = router;
