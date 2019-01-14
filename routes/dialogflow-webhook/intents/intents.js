const flowersIntentModule = require('./flowers');
const newAddressIntentModule = require('./edit-address');
const dialogflowResponse = require('../../models/dialogflow-response.json');
//firebase
var firebaseModule = require('../../chatfuel/firebase');
var firebase = firebaseModule.firebase();
//intent
exports.intents = function (intentRequest, sendResponse) {

  intnetMatch = intentRequest.queryResult.intent.displayName;

  switch (intnetMatch) {

    case 'choclate':
      return sendResponse(choclate(intentRequest));
      break;
    case 'Flowers':
      return flowersIntentModule.flowers().then(data => {
        dialogflowResponse.payload.facebook = data;
        return sendResponse(dialogflowResponse);
      });
      break;
    case 'Flowers - buy':
      return flowersBuy(intentRequest).then(data => {
        return sendResponse(data);
      });
      break;
    case 'Flowers - buy - address':
      return sendResponse(flowersBuyAddress(intentRequest));
      break;
    case 'new address':
      return sendResponse(newAddress(intentRequest));
      break;
    case 'chatfuel user address':
      return sendResponse(chatfuelAddress(intentRequest));
      break;
    case 'chatfuel user phone and email':
      return sendResponse(chatfuelPhoneEmail(intentRequest));
      break;
    default:
      {
        return sendResponse(choclate(intentRequest));
      }
  }
};

// intents

function choclate(req) {
  dialogflowResponse.payload.facebook = {
    attachment: {
      "type": "template",
      "payload": {
        "template_type": "button",
        "text": "This is button888",
        "buttons": [
          {
            "type": "web_url",
            "url": "https://www.youtube.com/1",
            "title": "URL Button",
            "webview_height_ratio": "compact"
          }
        ]
      }
    }
  }

  return dialogflowResponse;

}


// flower follow up intent
function flowersBuy(fulfillment) {
  return new Promise((resolve, reject) => {
    const flowerId = fulfillment.queryResult.parameters["number-sequence"];
    console.log(flowerId);
    return firebase.database().ref('send_them_flowers/flowers/' + flowerId).once('value').then(snapshot => {
      const responseString = "sure " + snapshot.val().name + " is a good choice! provide an address for delivery (include flat number, locality, city, zip)";
      dialogflowResponse.payload.facebook = {
        "text": responseString
      }
      return resolve(dialogflowResponse);
    }).catch(err => {
      return reject(err);
    });
  });
}

function flowersBuyAddress(fulfillment) {
  const locality = fulfillment.queryResult.parameters.any_address_before;
  const city = fulfillment.queryResult.parameters["geo-city"];
  const responseString = "provide recipient Name and Phone Number (example: Rakesh Singh, 9884628837)";
  dialogflowResponse.payload.facebook = {
    "text": responseString
  }

  return dialogflowResponse;
}

function newAddress(fulfillment) {

  const locality = fulfillment.queryResult.parameters['any_address_before'];
  const city = fulfillment.queryResult.parameters['geo-city'];
  var resposeObject = {
    text: "your new address is: " + locality + " " + city,
    quick_replies: [
      {
        "content_type": "text",
        "title": "prepare order again",
        "payload": "prepare order again"
      }
    ]
  }
  dialogflowResponse.payload.facebook = resposeObject;
  return dialogflowResponse;
}

function chatfuelAddress(fulfillment) {
  const before_address = fulfillment.queryResult.parameters['before_address'];
  const city = fulfillment.queryResult.parameters['city_address'];
  const after_address = fulfillment.queryResult.parameters['after_address'];
  const payload = {
    "payload": {
      "set_attributes": {
        "before_address": before_address,
        "city_address": city,
        "after_address": after_address
      }
    }
  };
  dialogflowResponse.fulfillmentMessages = [];
  dialogflowResponse.fulfillmentMessages.push(payload);

  return dialogflowResponse;
}

function chatfuelPhoneEmail(fulfillment) {
  const phone = fulfillment.queryResult.parameters['phone-number'];
  console.log(phone);
  const payload = {
    "payload": {
      "set_attributes": {
        "user_phone": phone
      }
    }
  };
  dialogflowResponse.fulfillmentMessages = [];
  dialogflowResponse.fulfillmentMessages.push(payload);
  return dialogflowResponse;
}