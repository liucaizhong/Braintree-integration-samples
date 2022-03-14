/* eslint-disable no-undef -- brainTree is global variable */
import React, { useEffect } from 'react';
import { Button, Divider, Input, Result } from 'antd';
// import axios from 'axios';

const Authorization = () => {
  useEffect(() => {
    braintree.client
      .create({
        authorization: process.env.REACT_APP_CLIENT_TOKEN,
      })
      .then((clientInstance) => {
        // Create a PayPal Checkout component.
        return braintree.paypalCheckout.create({
          client: clientInstance,
        });
      })
      .then((paypalCheckoutInstance) => {
        return paypalCheckoutInstance.loadPayPalSDK({
          currency: 'USD',
          intent: 'authorize',
        });
      })
      .then(function (paypalCheckoutInstance) {
        return paypal
          .Buttons({
            fundingSource: paypal.FUNDING.PAYPAL,

            createOrder: function () {
              return paypalCheckoutInstance.createPayment({
                flow: 'checkout', // Required
                amount: '1000', // Required
                currency: 'USD', // Required, must match the currency passed in with loadPayPalSDK
                requestBillingAgreement: true, // Required
                billingAgreementDetails: {
                  description: 'Description of the billng agreement to display to the customer',
                },

                intent: 'authorize', // Must match the intent passed in with loadPayPalSDK

                enableShippingAddress: true,
                shippingAddressEditable: false,
                shippingAddressOverride: {
                  recipientName: 'Scruff McGruff',
                  line1: '1234 Main St.',
                  line2: 'Unit 1',
                  city: 'Chicago',
                  countryCode: 'US',
                  postalCode: '60652',
                  state: 'IL',
                  phone: '123.456.7890',
                },
              });
            },

            onApprove: function (data, actions) {
              return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
                // Submit `payload.nonce` to your server
                const { nonce } = payload;
                if (nonce) {
                  console.log(nonce);
                  // axios
                  //   .post('/restapi/authorize', {
                  //     amount: '1000',
                  //     paymentMethodNonce: nonce,
                  //   })
                  //   .then((result) => {
                  //     console.log(result);
                  //   })
                  //   .catch((error) => {
                  //     console.error(error);
                  //   });
                }
              });
            },

            onCancel: function (data) {
              console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
            },

            onError: function (err) {
              console.error('PayPal error', err);
            },
          })
          .render('#paypal-button__authorization');
      })
      .then(function () {
        // The PayPal button will be rendered in an html element with the ID
        // `paypal-button`. This function will be called when the PayPal button
        // is set up and ready to be used
      });
  }, []);

  return (
    <>
      <Divider className="">Multiple authorizations</Divider>
      <div>
        <Input value="authorized amount: 1000USD" disabled />
        <div id="paypal-button__authorization"></div>
        <Result />
      </div>
      <div>
        <Input placeholder="transactionId" />
        <Button id="submit-button" type="primary" block>
          Void
        </Button>
        <Result />
      </div>
      <div>
        <Input placeholder="capture amount" />
        <Input placeholder="transactionId" />
        <Button id="submit-button" type="primary" block>
          Capture
        </Button>
        <Result />
      </div>
    </>
  );
};

export default Authorization;
