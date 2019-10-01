var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});

function HttpProxyHelper() {

  this.performSimpleProxy = function(req, res) {

    var url = req.url;
    var apiIdentifier = getApiIndentifier(url);

    logger.debug("Api identifier:"+apiIdentifier);

    if (!apiIdentifier) {
      logger.debug("We can't extract a valid api identifier from requested url:"+url);
      var status = {
        "status": 500,
        "message": "We can't extract a valid api identifier from requested url:"+url
      };
      res.json(status);
      return;
    }

    var registeredApiData = proxyRoutes[apiIdentifier];
    // var context = proxyRoutes[sourceHost].context;
    // logger.debug("Target " +targetHost+" was found for this source:"+sourceHost);

    if (typeof(registeredApiData) === "undefined") {
      logger.debug("Api identifier is not registered in Gateway: "+apiIdentifier);
      var status = {
        "status": 500,
        "message": "Api identifier is not registered in Gateway: "+apiIdentifier
      };
      res.json(status);
      return;
    }

    //replace api identifier from request object in order to
    //perform a success proxy invocation
    req.url = req.url.replace(apiIdentifier, "");
    logger.debug("New target url:"+req.url);
    logger.debug("New target host:"+registeredApiData.target);

    proxy.web(req, res, {
      target: registeredApiData.target
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
