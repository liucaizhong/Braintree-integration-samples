import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import 'antd/dist/antd.css';
import './index.css';
import App from './App';

const client = new ApolloClient({
  uri: '/api',
  cache: new InMemoryCache(),
  credentials: 'include',
  headers: {
    'Braintree-Version': '2021-11-11',
    authorization: process.env.REACT_APP_API_KEY,
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
