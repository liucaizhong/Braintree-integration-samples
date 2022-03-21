import React, { useState } from 'react';
import { Select } from 'antd';
import PaymentMethod, { PAYMENT_METHODS } from './components/PaymentMethod';
import './Purchase.css';

const { Option } = Select;

const Purchase = ({ total, buyer }) => {
  const [paymentMethod, setPaymentMethod] = useState('PayLater');
  const onChange = (value) => {
    setPaymentMethod(value);
  };

  return (
    <div className="purchase">
      <Select
        showSearch
        defaultValue="PayLater"
        style={{ width: '100%' }}
        placeholder="Select a payment method"
        optionFilterProp="children"
        onChange={onChange}
      >
        {[...PAYMENT_METHODS.keys()].map((key) => (
          <Option key={key} value={key}>
            {key}
          </Option>
        ))}
      </Select>
      <PaymentMethod type={paymentMethod} />
    </div>
  );
};

export default Purchase;
