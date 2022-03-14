import React from 'react';
import { Card, Input } from 'antd';

const Buyer = ({ defaultInfo, onChange }) => {
  const { firstName, lastName, phone, email, address } = defaultInfo;
  const { countryCode, state, city, line1, line2, postalCode } = address;
  // change the recipient information
  const changeInfo = (info) => {
    if (onChange) {
      onChange({
        ...defaultInfo,
        ...info,
      });
    }
  };

  return (
    <Card title="Recipient Information">
      <Input.Group compact>
        <Input
          placeholder="first name"
          style={{ width: '30%' }}
          defaultValue={firstName}
          onChange={(e) => changeInfo({ firstName: e.target.value })}
        />
        <Input
          placeholder="last name"
          style={{ width: '20%' }}
          defaultValue={lastName}
          onChange={(e) => changeInfo({ lastName: e.target.value })}
        />
        <Input
          placeholder="phone"
          style={{ width: '50%' }}
          defaultValue={phone}
          onChange={(e) => changeInfo({ phone: e.target.value })}
        />
      </Input.Group>
      <Input.Group compact>
        <Input placeholder="email" defaultValue={email} onChange={(e) => changeInfo({ email: e.target.value })} />
      </Input.Group>
      <Input.Group compact>
        <Input
          placeholder="countryCode"
          style={{ width: '30%' }}
          defaultValue={countryCode}
          onChange={(e) => changeInfo({ address: { ...address, countryCode: e.target.value } })}
        />
        <Input
          placeholder="state"
          style={{ width: '30%' }}
          defaultValue={state}
          onChange={(e) => changeInfo({ address: { ...address, state: e.target.value } })}
        />
        <Input
          placeholder="city"
          style={{ width: '40%' }}
          defaultValue={city}
          onChange={(e) => changeInfo({ address: { ...address, city: e.target.value } })}
        />
      </Input.Group>
      <Input.Group compact>
        <Input
          placeholder="address line1"
          defaultValue={line1}
          onChange={(e) => changeInfo({ address: { ...address, line1: e.target.value } })}
        />
      </Input.Group>
      <Input.Group compact>
        <Input
          placeholder="address line2"
          style={{ width: '80%' }}
          defaultValue={line2}
          onChange={(e) => changeInfo({ address: { ...address, line2: e.target.value } })}
        />
        <Input
          placeholder="postalCode"
          style={{ width: '20%' }}
          defaultValue={postalCode}
          onChange={(e) => changeInfo({ address: { ...address, postalCode: e.target.value } })}
        />
      </Input.Group>
    </Card>
  );
};

export default Buyer;
