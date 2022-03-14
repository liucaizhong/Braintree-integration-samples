/* eslint-disable no-undef -- brainTree is global variable */
import React, { useEffect, useRef, useState } from 'react';
import { Divider } from 'antd';
import axios from 'axios';

const Venmo = () => {
  const [hidden, setHidden] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const venmoButton = useRef(null);

  const showVenmoButton = (venmoInstance) => {
    // Assumes that venmoButton is initially display: none.
    setHidden(false);

    venmoButton.current.addEventListener('click', function () {
      setDisabled(true);

      venmoInstance.tokenize().then(handleVenmoSuccess).then(handleVenmoError);
    });
  };

  const handleVenmoError = (err) => {
    if (err.code === 'VENMO_CANCELED') {
      console.log('App is not available or user aborted payment flow');
    } else if (err.code === 'VENMO_APP_CANCELED') {
      console.log('User canceled payment flow');
    } else {
      console.error('An error occurred:', err.message);
    }
  };

  const handleVenmoSuccess = (payload) => {
    setDisabled(false);
    // Send payload.nonce to your server.
    console.log('Got a payment method nonce:', payload.nonce);
    // Display the Venmo username in your checkout UI.
    console.log('Venmo user:', payload.details.username);
  };

  useEffect(() => {
    // get token
    axios
      .get('/restapi/client_token')
      .then((result) => {
        const { data: token } = result;
        braintree.client
          .create({
            authorization: token,
          })
          .then(function (clientInstance) {
            // Create a Venmo component.
            return braintree.venmo.create({
              client: clientInstance,
              allowDesktop: true,
              paymentMethodUsage: 'multi_use', // available in v3.77.0+
            });
          })
          .then(function (venmoInstance) {
            // Verify browser support before proceeding.
            if (!venmoInstance.isBrowserSupported()) {
              console.log('Browser does not support Venmo');
              return;
            }
            showVenmoButton(venmoInstance);

            // Check if tokenization results already exist. This occurs when your
            // checkout page is relaunched in a new tab. This step can be omitted
            // if allowNewBrowserTab is false.
            if (venmoInstance.hasTokenizationResult()) {
              venmoInstance.tokenize().then(handleVenmoSuccess).catch(handleVenmoError);
            }
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
      <Divider>Venmo</Divider>
      <button
        ref={venmoButton}
        style={{
          display: hidden ? 'none' : 'block',
          background: 'url(./blue_venmo_button_280x48.svg)',
          width: '280px',
          height: '48px',
          outline: 'none',
          border: 'none',
          margin: '0 auto',
        }}
        disabled={disabled}
      />
    </>
  );
};

export default Venmo;
