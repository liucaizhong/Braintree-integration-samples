/* eslint-disable no-undef -- brainTree is global variable */
import React, { useEffect, useState } from 'react';
import { Divider, Select } from 'antd';
// import useChargePayPalAccount from '../hooks/useChargePayPalAccount';

const { Option } = Select;
const CURRENCY = ['USD', 'EUR'];

const PayPalCheckoutVault = () => {
  // const chargePayPalAccount = useChargePayPalAccount();
  const [currency, setCurrency] = useState(CURRENCY[0]);
  const onChange = (value) => {
    setCurrency(value);
  };
  let paypalInstance = null;

  useEffect(() => {
    if (paypalInstance) {
      paypal
        .Buttons({
          fundingSource: paypal.FUNDING.PAYPAL,

          createOrder: function () {
            return paypalInstance.createPayment({
              flow: 'checkout', // Required
              amount: 10.0, // Required
              currency: currency, // Required, must match the currency passed in with loadPayPalSDK
              requestBillingAgreement: true, // Required
              billingAgreementDetails: {
                description: 'Description of the billng agreement to display to the customer',
              },

              intent: 'capture', // Must match the intent passed in with loadPayPalSDK

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
            return paypalInstance.tokenizePayment(data).then(function (payload) {
              // Submit `payload.nonce` to your server
              // const { nonce } = payload;
              console.log(payload);
            });
          },

          onCancel: function (data) {
            console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
          },

          onError: function (err) {
            console.error('PayPal error', err);
          },
        })
        .render('#paypal-button__checkout_vault');
    } else {
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
            // currency: 'USD',
            intent: 'capture',
          });
        })
        .then(function (paypalCheckoutInstance) {
          paypalInstance = paypalCheckoutInstance;
          return paypal
            .Buttons({
              fundingSource: paypal.FUNDING.PAYPAL,

              createOrder: function () {
                return paypalCheckoutInstance.createPayment({
                  flow: 'checkout', // Required
                  amount: 10.0, // Required
                  currency: currency, // Required, must match the currency passed in with loadPayPalSDK
                  requestBillingAgreement: true, // Required
                  billingAgreementDetails: {
                    description: 'Description of the billng agreement to display to the customer',
                  },

                  intent: 'capture', // Must match the intent passed in with loadPayPalSDK

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
                  // const { nonce } = payload;
                  console.log(payload);
                });
              },

              onCancel: function (data) {
                console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
              },

              onError: function (err) {
                console.error('PayPal error', err);
              },
            })
            .render('#paypal-button__checkout_vault');
        })
        .then(function () {
          // The PayPal button will be rendered in an html element with the ID
          // `paypal-button`. This function will be called when the PayPal button
          // is set up and ready to be used
        });
    }
  }, [currency, paypalInstance]);
  return (
    <>
      <Divider>PayPal -- Checkout with Vault</Divider>
      <Select
        showSearch
        defaultValue={CURRENCY[0]}
        style={{ width: '100%' }}
        placeholder="Select a currency"
        optionFilterProp="children"
        onChange={onChange}
      >
        {CURRENCY.map((cur) => (
          <Option key={cur} value={cur}>
            {cur}
          </Option>
        ))}
      </Select>
      <div id="paypal-button__checkout_vault"></div>
    </>
  );
};

export default PayPalCheckoutVault;
