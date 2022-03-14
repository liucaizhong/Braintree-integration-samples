import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { PageHeader, Result } from 'antd';

const PaymentResult = () => {
  const history = useHistory();
  const { state } = useLocation();
  // show data and error message
  const { data, error } = state;

  return (
    <div>
      <PageHeader className="site-page-header" onBack={() => history.push('/')} title="Back" />
      {error ? (
        <Result
          style={{ wordBreak: 'break-word' }}
          status="error"
          title="Purchased Failed"
          subTitle={JSON.stringify(error.message)}
        />
      ) : (
        <Result
          style={{ wordBreak: 'break-word' }}
          status="success"
          title="Purchased Successfully"
          subTitle={JSON.stringify(data)}
        />
      )}
    </div>
  );
};

export default PaymentResult;
