import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PageHeader, Result } from 'antd';

const PaymentResult = () => {
  const history = useHistory();
  const { state } = useLocation();
  // show transaction(id, date) and error message
  const { transaction, error } = state;
  const { id, createdAt } = transaction;

  return (
    <div>
      <PageHeader className="site-page-header" onBack={() => history.push('/')} title="Back" />
      {error ? (
        <Result status="error" title="Submission Failed" subTitle={error} />
      ) : (
        <Result status="success" title="Successfully Purchased" subTitle={`TransactionId: ${id} ${createdAt}`} />
      )}
    </div>
  );
};

export default PaymentResult;
