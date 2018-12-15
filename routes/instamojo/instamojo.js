var express = require('express'), router = express.Router();
// instamojo configurations
var Insta = require('instamojo-nodejs');
Insta.setKeys('test_8ee3f513d3d06ec8e3de3149d11', 'test_c4dcc81e95a001669ee60a787fe');
Insta.isSandboxMode(true);

//get all
router.get('/api/payment',
  function (req, res) {
    // create payment data
    const data = new Insta.PaymentData();

    data.purpose = 'flower delivery'; //req.body.purpose;
    data.amount = '25';//req.body.amount;
    data.buyer_name = 'Dheeraj'//req.body.buyer_name;
    data.redirect_url = 'http://localhost:4200/#/';//req.body.redirect_url;
    data.email = 'paldheeraj25@gmail.com';//req.body.email;
    data.phone = '9885065575';//req.body.phone;
    data.send_email = false;
    data.webhook = 'http://requestbin.fullcontact.com/sz5d5ysz';
    data.send_sms = false;
    data.allow_repeated_payments = false;
    // create payment request

    Insta.createPayment(data, function (error, response) {
      if (error) {
        // some error
        return res.send(error);
      } else {
        // Payment redirection link at response.payment_request.longurl
        console.log(response);
        // const responseData = JSON.parse(response);
        // const redirectUrl = responseData.payment_request.longurl;
        // console.log(redirectUrl);

        return res.send(responseData);
      }
    });
  });

router.post('/api/payment/webhook', //passport.authenticate('jwt', { session: false }),
  function (req, res) {
    var ad = req.body;
    return res.send('webhook');
  });

module.exports = router;

