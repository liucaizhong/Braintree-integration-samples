/* eslint-disable no-undef -- brainTree is global variable */
import React, { useState, useEffect } from 'react';
import { Divider, Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const BNPL_CONFIGS = {
  US: {
    cur: 'USD',
    amount: '1200.00',
  },
  US1: {
    cur: 'USD',
    amount: '1000.00',
    buyerCountry: 'DE',
  },
  US2: {
    cur: 'EUR',
    amount: '1000.00',
    buyerCountry: 'US',
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
  DE1: {
    cur: 'USD',
    amount: '1500.00',
    buyerCountry: 'DE',
  },
  FR: {
    cur: 'EUR',
    amount: '1200.00',
  },
  FR1: {
    cur: 'USD',
    amount: '1500.00',
    // buyerCountry: 'US',
  },
  IT: {
    cur: 'EUR',
    amount: '1600.00',
  },
  IT1: {
    cur: 'AUD',
    amount: '1600.00',
  },
  ES: {
    cur: 'EUR',
    amount: '400.00',
  },
  ES1: {
    cur: 'USD',
    amount: '400.00',
  },
};

const PayLater = () => {
  const defaultBuyerCountry = 'US';
  const [buyerCountry, setBuyerCountry] = useState(defaultBuyerCountry);

  useEffect(() => {
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
                'buyer-country': BNPL_CONFIGS[buyerCountry].buyerCountry || buyerCountry.slice(0, 2), // for sandbox
                currency: BNPL_CONFIGS[buyerCountry].cur,
                'enable-funding': 'paylater',
                dataAttributes: {
                  amount: BNPL_CONFIGS[buyerCountry].amount,
                },
                // Other config options here
              })
              .then(function () {
                const button = paypal.Buttons({
                  style: {
                    color: 'gold',
                    shape: 'pill',
                  },
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
                      console.log('BNPL nonce: ', payload);
                    });
                  },
                });

                if (!button.isEligible()) {
                  // Skip rendering if not eligible
                  console.error("button isn't eligible");
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
        data-pp-buyerCountry={BNPL_CONFIGS[buyerCountry].buyerCountry || buyerCountry.slice(0, 2)}
        data-pp-currency={BNPL_CONFIGS[buyerCountry].cur}
        data-pp-amount={BNPL_CONFIGS[buyerCountry].amount}
        data-pp-style-logo-position="top"
      ></div>
      <div id="pay-later-button"></div>
    </>
  );
};

export default PayLater;
