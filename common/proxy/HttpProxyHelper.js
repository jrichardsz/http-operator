var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

function HttpProxyHelper() {

  this.performSimpleProxy = function(req, res) {

    var url = req.url;
    logger.debug(req.headers);
    var sourceIdentifier;
    sourceIdentifier = getApiIndentifier(url);

    if (!sourceIdentifier) {
      logger.debug("We can't extract a valid source identifier from requested url:"+url);
      sourceIdentifier = req.headers['host']
      if (!sourceIdentifier) {
        logger.debug("We can't extract a valid source identifier from requested host:"+req.headers['host']);
        var status = {
          "status": 500,
          "message": "We can't extract a valid source identifier using context or host header"
        };
        res.json(status);
        return;
      }
    }

    logger.debug("Source identifier:"+sourceIdentifier);

    var registeredApiData = proxyRoutes[sourceIdentifier];
    // var context = proxyRoutes[sourceHost].context;
    // logger.debug("Target " +targetHost+" was found for this source:"+sourceHost);

    if (typeof(registeredApiData) === "undefined") {
      logger.debug("Source identifier is not registered in Gateway: "+sourceIdentifier);
      var status = {
        "status": 500,
        "message": "Source identifier is not registered in Gateway: "+sourceIdentifier
      };
      res.json(status);
      return;
    }

    //replace api identifier from request object in order to
    //perform a success proxy invocation
    req.url = req.url.replace(sourceIdentifier, "");
    logger.debug("New target url:"+req.url);
    logger.debug("New target host:"+registeredApiData.target);

    proxy.web(req, res, {
      target: registeredApiData.target,
      changeOrigin: true
    });

  }


  function getApiIndentifier(url){
    if(url.startsWith("/")){
      var indexOfSecondSlash = url.indexOf("/",2);
      if(indexOfSecondSlash>0){
        return url.substring(0,url.indexOf("/",2));
      }
    }
  }

}

inheritsFrom(HttpProxyHelper, NodejsInjectableModule);
module.exports = HttpProxyHelper;
