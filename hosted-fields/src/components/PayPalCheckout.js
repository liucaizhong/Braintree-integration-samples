/* eslint-disable no-undef -- brainTree is global variable */
import React, { useEffect } from 'react';
import axios from 'axios';
import { Divider } from 'antd';
// import useChargePayPalAccount from '../hooks/useChargePayPalAccount';

const PayPalCheckout = () => {
  // const chargePayPalAccount = useChargePayPalAccount();

  useEffect(() => {
    axios
      .get('/restapi/client_token?customerId=Y3VzdG9tZXJfODI4NjYwNjYy')
      .then((result) => {
        const { data: token } = result;
        console.log(token);
        braintree.client
          .create({
            authorization: token,
          })
          .then(function (clientInstance) {
            // Create a PayPal Checkout component.
            return braintree.paypalCheckout.create({
              autoSetDataUserIdToken: true,
              client: clientInstance,
            });
          })
          .then(function (paypalCheckoutInstance) {
            return paypalCheckoutInstance.loadPayPalSDK({
              // currency: 'USD',
              // // intent: 'capture',
              // intent: 'authorize',
              // dataAttributes: {
              //   amount: '200.00',
              // },
            });
          })
          .then(function (paypalCheckoutInstance) {
            return paypal
              .Buttons({
                fundingSource: paypal.FUNDING.PAYPAL,

                createOrder: function () {
                  return paypalCheckoutInstance.createPayment({
                    flow: 'checkout', // Required
                    amount: 100.0, // Required
                    currency: 'USD', // Required, must match the currency passed in with loadPayPalSDK
                    // // intent: 'capture', // Must match the intent passed in with loadPayPalSDK
                    // intent: 'authorize',
                  });
                },

                onApprove: function (data, actions) {
                  return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
                    // Submit `payload.nonce` to your server
                    console.log(payload);
                  });
                },

                onCancel: function (data) {
                  console.log('PayPal payment canceled', JSON.stringify(data, 0, 2));
                },

                onError: function (err) {
                  console.error('PayPal error', err);
                },
              })
              .render('#paypal-button__checkout');
          })
          .then(function () {
            // The PayPal button will be rendered in an html element with the ID
            // `paypal-button`. This function will be called when the PayPal button
            // is set up and ready to be used
          })
          .catch(function (err) {
            // Handle component creation error
          });
      })
      .catch((error) => {
        console.error(error);
      });

    // braintree.client
    //   .create({
    //     authorization: process.env.REACT_APP_CLIENT_TOKEN,
    //   })
    //   .then((clientInstance) => {
    //     // Create a PayPal Checkout component.
    //     return braintree.paypalCheckout.create({
    //       client: clientInstance,
    //     });
    //   })
    //   .then((paypalCheckoutInstance) => {
    //     return paypalCheckoutInstance.loadPayPalSDK({
    //       currency: 'USD',
    //       intent: 'capture',
    //     });
    //   })
    //   .then((paypalCheckoutInstance) => {
    //     return paypal
    //       .Buttons({
    //         fundingSource: paypal.FUNDING.PAYPAL,

    //         createOrder: () => {
    //           return paypalCheckoutInstance.createPayment({
    //             flow: 'checkout', // Required
    //             amount: 10.0, // Required
    //             currency: 'USD', // Required, must match the currency passed in with loadPayPalSDK
    //             intent: 'capture', // Must match the intent passed in with loadPayPalSDK
    //             enableShippingAddress: true,
    //             shippingAddressEditable: false,
    //             shippingAddressOverride: {
    //               recipientName: 'Scruff McGruff',
    //               line1: '1234 Main St.',
    //               line2: 'Unit 1',
    //               city: 'Chicago',
    //               countryCode: 'US',
    //               postalCode: '60652',
    //               state: 'IL',
    //               phone: '123.456.7890',
    //             },
    //           });
    //         },

    //         onApprove: (data, actions) => {
    //           return paypalCheckoutInstance.tokenizePayment(data).then((payload) => {
    //             // Submit `payload.nonce` to your server
    //             const { nonce } = payload;
    //             if (nonce) {
    //               chargePayPalAccount(nonce);
    //             }
    //           });
    //         },

    //         onCancel: (data) => {
    //           console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
    //         },

    //         onError: (err) => {
    //           console.error('PayPal error', err);
    //         },
    //       })
    //       .render('#paypal-button__checkout');
    //   })
    //   .then(() => {
    //     // The PayPal button will be rendered in an html element with the ID
    //     // `paypal-button`. This function will be called when the PayPal button
    //     // is set up and ready to be used
    //   });
  });
  return (
    <>
      <Divider className>PayPal -- Checkout</Divider>
      <div id="paypal-button__checkout"></div>
    </>
  );
};

export default PayPalCheckout;
