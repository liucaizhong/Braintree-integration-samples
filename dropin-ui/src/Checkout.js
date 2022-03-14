import React, { useState } from 'react';
import { Button, Drawer } from 'antd';
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

  return (
    <div className="app">
      <Buyer defaultInfo={customer} onChange={setCustomer} />
      <Product info={product} />
      <Button className="checkout-btn" type="primary" block onClick={togglePayment}>
        Checkout
      </Button>
      <Drawer height="fit-content" closable placement="bottom" visible={paymentVisible} onClose={togglePayment}>
        <Purchase total={product.amount * product.price} buyer={customer} />
      </Drawer>
    </div>
  );
};

export default Checkout;
