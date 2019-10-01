var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({});

function HttpGetMethodClient() {

  this.performRequest = function(req, res) {
    proxy.web(req, res, { target: 'http://localhost:8085' });
  }

}

inheritsFrom(HttpGetMethodClient, NodejsInjectableModule);
module.exports = HttpGetMethodClient;
