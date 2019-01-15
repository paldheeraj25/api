// jwt token
var jwt = require('jsonwebtoken');

exports.validateUser = function (req, res, next) {
  const body = req.body;
  const bearerToken = body['stf_api_token'];
  let message;
  if (typeof bearerToken !== 'undefined') {
    jwt.verify(bearerToken, '',
      (err, authData) => {
        if (err) {
          message = {
            "messages": [
              { "text": "invalid user token" },
            ]
          };
          return res.send(err);;
        } else {
          req.body.authData = authData;
          next();
        }
      });
  } else {
    message = {
      "messages": [
        { "text": "invalid user" },
      ]
    };

    return res.send(message);;
  }
}
