const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
    app.use('/api',
        createProxyMiddleware({
            target: 'http://106.13.178.134:1055',
            changeOrigin: true,
            pathRewrite: {
                "^/api": ""
            }
        }
        ));
}