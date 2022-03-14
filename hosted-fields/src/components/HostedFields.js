/* eslint-disable no-undef -- brainTree is global variable */
import React, { useEffect, useState } from 'react';
import { Button, Divider } from 'antd';
import axios from 'axios';
import useChargeCreditCard from '../hooks/useChargeCreditCard';
import './HostedFields.css';

const HostedFields = () => {
  const [disabled, setDisabled] = useState(true);
  const chargeCreditCard = useChargeCreditCard();

  useEffect(() => {
    let threeDSecure;

    // 3dSecure
    axios
      .get('/restapi/client_token')
      .then((result) => {
        const { data: token } = result;
        braintree.client
          .create({
            authorization: token,
          })
          .then(function (clientInstance) {
            return braintree.threeDSecure.create({
              version: 2, // Will use 3DS2 whenever possible
              client: clientInstance,
            });
          })
          .then(function (threeDSecureInstance) {
            threeDSecure = threeDSecureInstance;
          })
          .catch(function (err) {
            // Handle component creation error
          });
      })
      .catch((error) => {
        console.error(error);
      });

    // initialize hosted fields
    braintree.client
      .create({
        authorization: process.env.REACT_APP_CLIENT_TOKEN,
      })
      .then(function (clientInstance) {
        const options = {
          client: clientInstance,
          styles: {
            input: {
              'font-size': '14px',
            },
            'input.invalid': {
              color: 'red',
            },
            'input.valid': {
              color: 'green',
            },
          },
          fields: {
            number: {
              container: '#cardNumber',
              prefill: '4111111111111111',
              placeholder: 'Please input your card number, eg.4111 1111 1111 1111',
            },
            cvv: {
              container: '#cvv',
              prefill: '123',
              placeholder: 'Please input CVV, eg.123',
            },
            expirationDate: {
              container: '#expirationDate',
              prefill: '102022',
              placeholder: 'Please input the expiration date(MM/YYYY), eg.10/2022',
            },
          },
        };
        return braintree.hostedFields.create(options);
      })
      .then(function (fieldsInstance) {
        setDisabled(false);

        document.getElementById('submit-button').addEventListener('click', () => {
          fieldsInstance.tokenize((tokenizeError, payload) => {
            if (tokenizeError) {
              console.error(tokenizeError);
              return;
            }
            // Submit `payload.nonce` to your server
            const {
              nonce,
              details: { bin },
            } = payload;
            console.log('nonce', nonce);
            if (nonce) {
              // for 3DSecure
              const threeDSecureParameters = {
                amount: '599.00',
                nonce: nonce, // Example: hostedFieldsTokenizationPayload.nonce
                bin: bin, // Example: hostedFieldsTokenizationPayload.details.bin
                email: 'test@example.com',
                billingAddress: {
                  givenName: 'Jill', // ASCII-printable characters required, else will throw a validation error
                  surname: 'Doe', // ASCII-printable characters required, else will throw a validation error
                  phoneNumber: '8101234567',
                  streetAddress: '555 Smith St.',
                  extendedAddress: '#5',
                  locality: 'Oakland',
                  region: 'CA',
                  postalCode: '12345',
                  countryCodeAlpha2: 'US',
                },
                additionalInformation: {
                  workPhoneNumber: '8101234567',
                  shippingGivenName: 'Jill',
                  shippingSurname: 'Doe',
                  shippingPhone: '8101234567',
                  shippingAddress: {
                    streetAddress: '555 Smith St.',
                    extendedAddress: '#5',
                    locality: 'Oakland',
                    region: 'CA',
                    postalCode: '12345',
                    countryCodeAlpha2: 'US',
                  },
                },
                onLookupComplete: function (data, next) {
                  // use `data` here, then call `next()`
                  next();
                },
              };

              threeDSecure
                .verifyCard(threeDSecureParameters)
                .then(function (response) {
                  // Send response.nonce to your server for use in your integration
                  // The 3D Secure Authentication ID can be found
                  //  at response.threeDSecureInfo.threeDSecureAuthenticationId
                  console.log(response);
                  const { nonce } = response;
                  chargeCreditCard(nonce);
                })
                .catch(function (error) {
                  // Handle error
                });
            }
          });
        });
      })
      .catch(function (err) {
        // Handle error in component creation
      });
  });

  return (
    <>
      <Divider>Hosted Fields</Divider>
      <form id="paymentInfo">
        <label htmlFor="cardNumber">Card Number</label>
        <div className="hosted-field" id="cardNumber"></div>

        <label htmlFor="cvv">CVV</label>
        <div className="hosted-field" id="cvv"></div>

        <label htmlFor="expirationDate">Expiration Date</label>
        <div className="hosted-field" id="expirationDate"></div>

        <Button id="submit-button" type="primary" block disabled={disabled}>
          Pay
        </Button>
      </form>
    </>
  );
};

export default HostedFields;
