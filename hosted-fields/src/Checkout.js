/* eslint-disable no-undef -- brainTree is global variable */
import React, { useState, useEffect } from 'react';
import { Button, Drawer } from 'antd';
// import axios from 'axios';
import Buyer from './Buyer';
import Product from './Product';
import Purchase from './Purchase';
import './Checkout.css';

const Checkout = () => {
  // mock product information
  const product = {
    name: 'Jordan NBA Swingman Jersey T-Shirt',
    amount: 1,
    price: 599,
    desc: '2020 Season Los Angeles Statement Edition',
  };
  // mock recipient information
  const [customer, setCustomer] = useState({
    firstName: 'Caizhong',
    lastName: 'Liu',
    email: 'jojoliu12345@gmail.com',
    phone: '17717390859',
    address: {
      countryCode: 'US',
      state: 'NV',
      city: 'Las Vegas',
      line1: '6718 W Sunset Rd STE180',
      line2: '',
      postalCode: '89118',
    },
  });

  // control the payment drawer is visible or not
  const [paymentVisible, setPaymentVisible] = useState(false);
  const togglePayment = () => {
    setPaymentVisible(!paymentVisible);
  };

  useEffect(() => {
    // axios
    //   .get(`/restapi/client_token?country=US`)
    //   .then((result) => {
    //     const { data: token } = result;
    //     console.log('bnpl token: ', token);
    braintree.client
      .create({
        authorization: process.env.REACT_APP_CLIENT_TOKEN,
        // authorization: token,
      })
      .then((clientInstance) => {
        // Create a PayPal Checkout component.
        return braintree.paypalCheckout.create({
          client: clientInstance,
        });
      })
      .then((paypalCheckoutInstance) => {
        paypalCheckoutInstance.loadPayPalSDK({
          components: 'messages',
          // 'buyer-country': 'FR', // for sandbox
          // 'enable-funding': 'paylater',
          // Other config options here
        });
      });
    // })
    // .catch((error) => {
    //   console.error(error);
    // });
  }, []);

  return (
    <div className="app">
      <div
        data-pp-message
        data-pp-layout="text"
        data-pp-text-color="black"
        data-pp-logo-type="inline"
        data-pp-buyerCountry="US"
        data-pp-placement="home"
        data-pp-currency="USD"
        // data-pp-amount="393.08"
      ></div>
      <div
        data-pp-message
        data-pp-placement="home"
        data-pp-style-color="blue"
        data-pp-style-layout="flex"
        data-pp-style-ratio="1x1"
        data-pp-buyerCountry="FR"
        data-pp-currency="EUR"
        data-pp-amount="120"
      ></div>
      <Buyer defaultInfo={customer} onChange={setCustomer} />
      <Product info={product} />
      <Button className="checkout-btn" type="primary" block onClick={togglePayment}>
        Checkout
      </Button>
      <Drawer height="fit-content" closable={false} placement="bottom" visible={paymentVisible} onClose={togglePayment}>
        <Purchase total={product.amount * product.price} buyer={customer} />
      </Drawer>
    </div>
  );
};

export default Checkout;
