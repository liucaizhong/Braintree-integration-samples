import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Checkout from './Checkout';
import PaymentResult from './PaymentResult';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Checkout />
        </Route>
        <Route path="/paymentResult">
          <PaymentResult />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
