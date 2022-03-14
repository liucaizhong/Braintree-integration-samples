/* eslint-disable no-undef -- brainTree is global variable */
import React, { useState, useEffect } from 'react';
import { Divider, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const BNPL_CONFIGS = {
  US: {
    cur: 'USD',
    amount: '1500.00',
  },
  AU: {
    cur: 'AUD',
    amount: '1000.00',
  },
  GB: {
    cur: 'GBP',
    amount: '2000.00',
  },
  DE: {
    cur: 'EUR',
    amount: '1000.00',
  },
  FR: {
    cur: 'EUR',
    amount: '1800.00',
  },
  IT: {
    cur: 'EUR',
    amount: '1600.00',
  },
  ES: {
    cur: 'EUR',
    amount: '1400.00',
  },
};

const PayLater = () => {
  const defaultBuyerCountry = 'FR';
  const [buyerCountry, setBuyerCountry] = useState(defaultBuyerCountry);

  useEffect(() => {
    console.log('buyer country: ', buyerCountry);
    // 3dSecure
    axios
      .get(`/restapi/client_token?country=${buyerCountry}`)
      .then((result) => {
        const { data: token } = result;
        console.log('bnpl token: ', token);
        braintree.client
          .create({
            authorization: token,
          })
          .then((clientInstance) => {
            // Create a PayPal Checkout component.
            return braintree.paypalCheckout.create({
              client: clientInstance,
            });
          })
          .then((paypalCheckoutInstance) => {
            paypalCheckoutInstance
              .loadPayPalSDK({
                components: 'buttons,messages',
                'buyer-country': buyerCountry,
                currency: BNPL_CONFIGS[buyerCountry].cur,
                'enable-funding': 'paylater',
                dataAttributes: {
                  amount: BNPL_CONFIGS[buyerCountry].amount,
                },
                // Other config options here
              })
              .then(function () {
                const button = paypal.Buttons({
                  fundingSource: paypal.FUNDING.PAYLATER,
                  createOrder: function () {
                    return paypalCheckoutInstance.createPayment({
                      flow: 'checkout', // Required
                      amount: BNPL_CONFIGS[buyerCountry].amount, // Required
                      currency: BNPL_CONFIGS[buyerCountry].cur, // Required
                    });
                  },
                  onApprove: function (data, actions) {
                    return paypalCheckoutInstance.tokenizePayment(data).then(function (payload) {
                      // Submit `payload.nonce` to your server
                      console.log('BNPL nonce: ', payload.nonce);
                    });
                  },
                });

                if (!button.isEligible()) {
                  // Skip rendering if not eligible
                  return;
                }

                button.render('#pay-later-button');
              });
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [buyerCountry]);

  return (
    <>
      <Divider>Pay Later</Divider>
      <Select
        defaultValue={defaultBuyerCountry}
        style={{
          width: '100%',
          marginBottom: '30px',
        }}
        placeholder="Select country"
        onChange={(value) => {
          setBuyerCountry(value);
        }}
      >
        <Option value="US">United States</Option>
        <Option value="GB">United Kingdom</Option>
        <Option value="FR">France</Option>
        <Option value="DE">Germany</Option>
        <Option value="AU">Australia</Option>
        <Option value="IT">Italy</Option>
        <Option value="ES">Spain</Option>
      </Select>
      <div
        data-pp-message
        data-pp-layout="text"
        data-pp-text-color="black"
        data-pp-logo-type="inline"
        data-pp-buyerCountry={buyerCountry === 'FR' ? 'FR' : undefined}
        data-pp-amount={BNPL_CONFIGS[buyerCountry].amount}
      ></div>
      <div id="pay-later-button"></div>
    </>
  );
};

export default PayLater;
