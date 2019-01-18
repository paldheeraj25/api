var express = require('express'), router = express.Router();


// user validate
var validateUsermodule = require('./validate-user');

// TODO: protect rout with jwt
router.post('/api/chatfuel/person/type', //validateUsermodule.validateUser,
  function (req, res) {

    const message = {
      "messages": [
        {
          "text": "I am Laxmi ur flower astrology specialist!  ,! 🥰 😍😍  select 👇🏻  the person and find the flowers 🌹 which compliment their energy ⚡ and vibrations 🌌..",
          "quick_replies": [
            {
              "title": "gf / bf",
              "set_attributes": {
                "person_type": "gf or bf"
              }
            },
            {
              "title": "wife / husband",
              "set_attributes": {
                "person_type": "wife or husband"
              }
            },
            {
              "title": "mom / dad",
              "set_attributes": {
                "person_type": "mom or dad"
              }
            },
            {
              "title": "best/close friend",
              "set_attributes": {
                "person_type": "best or close friend"
              }
            },
            {
              "title": "friend / relative",
              "set_attributes": {
                "person_type": "friend or relative"
              }
            },
            {
              "title": "others",
              "set_attributes": {
                "person_type": "others"
              }
            },
          ]
        }
      ]
    };
    // return  statment
    return res.send(message);
  });

// TODO: protect rout with jwt
router.post('/api/chatfuel/occasion/type', //validateUsermodule.validateUser,
  function (req, res) {

    const message = {
      "messages": [
        {
          "text": "What is the occasion or purpose of the flowers..",
          "quick_replies": [
            {
              "title": "valentine's special",
              "set_attributes": {
                "occasion_type": "valentine"
              }
            },
            {
              "title": "love affection",
              "set_attributes": {
                "occasion_type": "love affection"
              }
            },
            {
              "title": "sorry",
              "set_attributes": {
                "occasion_type": "sorry"
              }
            },
            {
              "title": "thank you",
              "set_attributes": {
                "occasion_type": "thank you"
              }
            },
            {
              "title": "happy moments",
              "set_attributes": {
                "occasion_type": "happy moments"
              }
            },
            {
              "title": "other",
              "set_attributes": {
                "occasion_type": "other"
              }
            }
          ]
        }
      ]
    };
    // return  statment
    return res.send(message);
  });

// TODO: protect rout with jwt
router.post('/api/chatfuel/selection/match', //validateUsermodule.validateUser,
  function (req, res) {
    const personType = req.body['person_type'];
    const persontMatchText = {
      "gf or bf": "the bond vibes r RED, emotions range from love & desire to anger & destruction. Here r carefully put together petals, Include cosmic energy and vibes of RED & contain the essence of warmth, intimacy & passion",

      "wife or husband": "the bond vibes r RED & YELLOW, Contains passion of RED and trust of YELLOW. Here r carefully put together petals, Include cosmic energy and vibes of RED n YELLOW wid well mixed essence of love, intimacy & trust",

      "mom or dad": "the bond vibes r WHITE, Its clean, pure and love without expectation. Here r carefully put together petals, Include cosmic energy and vibes of WHITE & contain the essence of love and pride",

      "best or close friend": "the bond vibes r PINK, has innocence of white and the passion of red with a flair of mischief. Here r carefully put together petals, Include cosmic energy and vibes of PINK & contain the essence of trust and playfulness",

      "friend or relative": "the bond vibes r MIXED, representative of happiness, illumination, and warmth. Here r carefully put together petals, Include cosmic energy and vibes of MIXED & contain the essence of respect, happiness and cheerfulness",

      "others": "the bond vibes r MIXED, representative of happiness, illumination, and warmth. Here r carefully put together petals, Include cosmic energy and vibes of MIXED & contain the essence of respect, happiness and cheerfulness"
    };
    // return  statment
    const message = {
      messages: [
        { "text": persontMatchText[personType] },
      ]
    }
    return res.send(message);
  });

module.exports = router;
