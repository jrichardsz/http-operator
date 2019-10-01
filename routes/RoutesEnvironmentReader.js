
function RoutesEnvironmentReader() {

  this.saveRoutesAsGlobal = function() {
    var environments = process.env;

    var rawRouteData = [];
    for(key in environments){
      if(key.startsWith("proxy_data")){
        if(key.endsWith("_context")){
          //save only identifier
          rawRouteData.push(key.replace("_context",""));
        }
      }
    }

    logger.debug(rawRouteData);

    var proxyRoutes = {};

    for(identifier of rawRouteData){      

      if(process.env[identifier+"_context"]){
        if(process.env[identifier+"_target"]){
          proxyRoutes[process.env[identifier+"_context"]] = {
            "target":process.env[identifier+"_target"]
          };
        }
      }

    }

    logger.info(proxyRoutes);
    global['proxyRoutes'] = proxyRoutes;

  }

}

inheritsFrom(RoutesEnvironmentReader, NodejsInjectableModule);
module.exports = RoutesEnvironmentReader;
