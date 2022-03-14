const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://payments.sandbox.braintree-api.com/graphql',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );

  app.use(
    createProxyMiddleware('/restapi', {
      target: 'http://localhost:5001/',
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/restapi': '',
      },
    })
  );
};
