var express = require('express');
var router = express.Router();
const braintree = require('braintree');
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: 'wc53z3w7kgs9pdc6',
  publicKey: 'vvck6gyvq8kjz47g',
  privateKey: 'c763be2dd0968f6e7cbaac93cf91fe25'
});

router.post('/checkout', (req, res) => {
  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction
  const amount = req.body.amount;
  gateway.transaction.sale({
    amount,
    paymentMethodNonce: nonceFromTheClient,
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      submitForSettlement: true
    }
  }, (error, result) => {
      if (result) {
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

// maid configs
const BNPL_CONFIGS = {
  US: 'paypal_us_usd',
  US1: 'paypal_us_eur',
  GB: 'paypal_uk_gbp',
  FR: 'paypal_fr_eur',
  FR1: 'paypal_lu_usd',
  DE: 'paypal_de_eur',
  AU: 'paypal_au_aud',
  IT: 'paypal_it_eur',
  ES: 'paypal_es_eur',
  ILS: 'AE_SG_ILS',
  MXN: 'AE_SG_MXN',
};
router.get('/client_token', (req, res) => {
  gateway.clientToken.generate({
    merchantAccountId: BNPL_CONFIGS[req.query.country || 'US'],
    customerId: req.query.customerId,
  }).then(response => {
    res.send(response.clientToken);
  });
})

router.post('/authorize', (req, res) => {
  // Use the payment method nonce here
  const nonceFromTheClient = req.body.paymentMethodNonce;
  // Create a new transaction
  const amount = req.body.amount;
  gateway.transaction.sale({
    amount,
    paymentMethodNonce: nonceFromTheClient,
    merchantAccountId: 'paypal_us_usd',
    options: {
      // This option requests the funds from the transaction
      // once it has been authorized successfully
      storeInVaultOnSuccess: true
    }
  }, (error, result) => {
      if (result) {
        console.log(result);
        res.send(result);
      } else {
        res.status(500).send(error);
      }
  });
});

module.exports = router;
