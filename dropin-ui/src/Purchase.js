/* eslint-disable no-undef -- brainTree is global variable */
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { Button, Spin } from 'antd';
import './Purchase.css';

const Purchase = ({ total, buyer }) => {
  const history = useHistory();
  const { address, firstName, lastName } = buyer;
  // submit button is visible when pay by card and interact with server-side
  const [submitVisible, setSubmitVisible] = useState(false);
  // show loading indicator when interact with server-side
  const [isSubmitting, setIsSubmitting] = useState(false);
  // post transaction to server-side
  const createTransaction = (nonce) => {
    if (!nonce) {
      setIsSubmitting(false);
      return;
    }
    setIsSubmitting(true);

    axios({
      method: 'post',
      url: '/checkout',
      data: {
        paymentMethodNonce: nonce,
        amount: total,
      },
    })
      .then((result) => {
        const { data } = result;
        history.push('/paymentResult', {
          transaction: data.transaction,
        });
      })
      .catch((error) => {
        history.push('/paymentResult', {
          error: error,
        });
      });
  };

  useEffect(() => {
    // use braintree to render UI
    braintree.dropin.create(
      {
        authorization: process.env.REACT_APP_CLIENT_TOKEN,
        selector: '#dropin-container',
        paypal: {
          flow: 'checkout',
          shippingAddressOverride: {
            ...address,
            recipientName: `${firstName} ${lastName}`,
          },
          amount: total,
          currency: 'USD',
        },
      },
      (error, instance) => {
        // render submit button
        document.getElementById('submit-button').addEventListener('click', () => {
          instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
            const { nonce } = payload;

            createTransaction(nonce);
          });
        });

        // detect active view to control the submit button
        instance.on('changeActiveView', (activeView) => {
          const { newViewId, previousViewId } = activeView;
          if (newViewId === 'card') {
            setSubmitVisible(true);
          }
          if (newViewId === 'options' || newViewId === 'paypal') {
            setSubmitVisible(false);
          }

          if (newViewId === 'methods') {
            setSubmitVisible(false);
          }

          if (newViewId === 'methods' && previousViewId === 'paypal') {
            instance.requestPaymentMethod((requestPaymentMethodErr, payload) => {
              const { nonce } = payload;

              createTransaction(nonce);
            });
          }
        });
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps -- only retrigger when total and buyer change
  }, [total, buyer]);

  return (
    <div className="purchase">
      <Spin className="spin" tip="Submitting" spinning={isSubmitting} />
      <div className="total">${total}</div>
      <div id="dropin-container" />
      <Button style={{ display: submitVisible ? 'block' : 'none' }} id="submit-button" type="primary" block>
        Submit
      </Button>
    </div>
  );
};

export default Purchase;
