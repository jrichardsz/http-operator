
function RoutesEnvironmentReader() {

  this.saveRoutesAsGlobal = function() {
    var environments = process.env;

    var rawRouteData = [];
    for(key in environments){
      if(key.startsWith("proxy_data")){
        if(key.endsWith("_source")){
          //save only identifier
          rawRouteData.push(key.replace("_source",""));
        }
      }
    }

    logger.debug(rawRouteData);

    var proxyRoutes = {};

    for(identifier of rawRouteData){

      if(process.env[identifier+"_source"]){
        if(process.env[identifier+"_target"]){
          proxyRoutes[process.env[identifier+"_source"]] = {
            "target":parseTarget(identifier, process.env[identifier+"_target"])
          };
        }
      }
    }

    logger.info(proxyRoutes);
    global['proxyRoutes'] = proxyRoutes;

  }

  function parseTarget(identifier, rawTarget){
    if(typeof rawTarget === 'undefined' || rawTarget == ""){
      logger.error(`source identifier: ${identifier} have an empty or wrong target`);
      return [];
    }

    return rawTarget.replace(/ /g,'').split(",")
  }

}

inheritsFrom(RoutesEnvironmentReader, NodejsInjectableModule);
module.exports = RoutesEnvironmentReader;
