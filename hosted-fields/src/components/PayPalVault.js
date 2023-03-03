/* eslint-disable no-undef -- brainTree is global variable */
import React, { useEffect } from 'react';
import { Divider } from 'antd';
import axios from 'axios';

const PayPalVault = () => {
  useEffect(() => {
    axios
      .get(`/restapi/client_token?country=US`)
      .then((result) => {
        const { data: token } = result;
        console.log('bnpl token: ', token);
        braintree.client
          .create({
            authorization: token,
            // authorization: process.env.REACT_APP_CLIENT_TOKEN,
          })
          .then((clientInstance) => {
            return braintree.paypalCheckout.create({
              client: clientInstance,
            });
          })
          .then((paypalCheckoutInstance) => {
            return paypalCheckoutInstance.loadPayPalSDK({
              vault: true,
            });
          })
          .then((paypalCheckoutInstance) => {
            return paypal
              .Buttons({
                style: {
                  color: 'black',
                  // shape: 'pill',
                  // edges: 'hard',
                  label: 'buynow',
                },

                fundingSource: paypal.FUNDING.PAYPAL,

                createBillingAgreement: function () {
                  return paypalCheckoutInstance.createPayment({
                    flow: 'vault', // Required

                    // The following are optional params
                    billingAgreementDescription: 'Alibaba Cloud',
                    // enableShippingAddress: true,
                    // shippingAddressEditable: false,
                    // shippingAddressOverride: {
                    //   recipientName: 'Scruff McGruff',
                    //   line1: '1234 Main St.',
                    //   line2: 'Unit 1',
                    //   city: 'Chicago',
                    //   countryCode: 'US',
                    //   postalCode: '60652',
                    //   state: 'IL',
                    //   phone: '123.456.7890',
                    // },
                  });
                },

                onApprove: (data, actions) => {
                  return paypalCheckoutInstance.tokenizePayment(data).then((payload) => {
                    // Submit `payload.nonce` to your server
                    // const { nonce } = payload;
                    console.log(payload);
                  });
                },

                onCancel: (data) => {
                  console.log('PayPal payment canceled', JSON.stringify(data, 0, 2));
                },

                onError: (err) => {
                  console.error('PayPal error', err);
                },
              })
              .render('#paypal-button__vault');
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
  });

  return (
    <>
      <Divider>PayPal -- Vault</Divider>
      <div id="paypal-button__vault"></div>
    </>
  );
};

export default PayPalVault;
