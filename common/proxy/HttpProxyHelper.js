var roundround = require('roundround');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

function HttpProxyHelper() {

  this.distributeStrategyDefault = 'round-robin';
  this.distributeStrategyMap = {};

  this.performSimpleProxy = (req, res)=> {

    var url = req.url;
    logger.debug(req.url+ " headers: " +JSON.stringify(req.headers));
    var sourceIdentifier = sourceIdentifier = req.headers['host']
    if (!sourceIdentifier) {
      logger.debug("We can't extract a valid source identifier from requested host:"+req.headers['host']);
      var status = {
        "status": 500,
        "message": "We can't extract a valid source identifier using context or host header"
      };
      res.json(status);
      return;
    }

    logger.debug("Source identifier:"+sourceIdentifier);

    var registeredApiData = proxyRoutes[sourceIdentifier];

    if (typeof(registeredApiData) === "undefined") {
      logger.debug("Source identifier is not registered in Gateway: "+sourceIdentifier);
      var status = {
        "status": 500,
        "message": "Source identifier is not registered in Gateway: "+sourceIdentifier
      };
      res.json(status);
      return;
    }

    if (typeof registeredApiData.target === 'undefined' || registeredApiData.target.length==0) {
      logger.debug("Source identifier has a wrong or empty target");
      var status = {
        "status": 500,
        "message": "Source identifier has a wrong or empty target: "+sourceIdentifier
      };
      res.json(status);
      return;
    }

    //@TODO: ensure target host syntax is well because it throws low level http errors
    /*
    http-operator/node_modules/http-proxy/lib/http-proxy/index.js:120throw err;
    Error: connect ECONNREFUSED 127.0.0.1:80
        at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1107:14)
    */

    //get the target host using distribute strategy
    if(typeof this.distributeStrategyMap[sourceIdentifier] === 'undefined'){
      this.distributeStrategyMap[sourceIdentifier] = roundround(registeredApiData.target)
    }

    var selectedTarget = this.distributeStrategyMap[sourceIdentifier]();
    logger.debug(`New target url: ${selectedTarget}${req.url}`);
    proxy.web(req, res, {
      target: selectedTarget
    });

  }

}

inheritsFrom(HttpProxyHelper, NodejsInjectableModule);
module.exports = HttpProxyHelper;
