import React from 'react';
import HostedFields from './HostedFields';
import PayPalVault from './PayPalVault';
import PayPalCheckout from './PayPalCheckout';
import PayPalCheckoutVault from './PayPalCheckoutVault';
import PayLater from './PayLater';
import Venmo from './Venmo';
import Authorization from './Authorization';

export const PAYMENT_METHODS = new Map([
  ['HostedFields', <HostedFields />],
  ['PayPalVault', <PayPalVault />],
  ['PayPalCheckout', <PayPalCheckout />],
  ['PayPalCheckoutVault', <PayPalCheckoutVault />],
  ['PayLater', <PayLater />],
  ['Venmo', <Venmo />],
  ['Authorization', <Authorization />],
]);

const PaymentMethod = ({ type = 'HostedFields' }) => {
  return PAYMENT_METHODS.get(type);
};

export default PaymentMethod;
