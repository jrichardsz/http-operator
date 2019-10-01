const fs = require('fs');
const path = require('path');
var currentWorkingDirectory = process.cwd()

var NodejsInjectableModule = function() {};

global.NodejsInjectableModule = NodejsInjectableModule;

global.inheritsFrom = function(child, parent) {
  child.prototype = Object.create(parent.prototype);
};

function JavascriptModulesDiscover() {

}

JavascriptModulesDiscover.scan = function(excludes) {
  logger.info("Automatic scanning of nodejs functions...");
  logger.debug(excludes);

  var files = []
  getJsFiles(currentWorkingDirectory, files);

  logger.debug(files);

  for (var key in files) {
    var file = files[key];
    var ext = path.extname(file);
    var fileName = path.basename(file);
    if (file.includes("JavascriptModulesDiscover.js") || file.includes("NodejsInjectableModule.js")) {
      continue;
    }
    if (excludes.includes(fileName)) {
      continue;
    }

    var functionRequire = require(file);
    logger.debug("Detected file:" + file)

    var functionInstance = new functionRequire();
    if (functionInstance.constructor.name !== "NodejsInjectableModule") {
      continue;
    }

    logger.info("New injectable module detected:" + file);
    logger.info("Instantiation is starting...");
    logger.debug("functionInstance.constructor.name:" + functionInstance.constructor.name);


    var functionName = path.basename(file).replace(ext, "");
    var functionInstanceName = functionName.charAt(0).toLowerCase() + functionName.slice(1);
    var functionInstanceName = functionName.charAt(0).toLowerCase() + functionName.slice(1);
    global[functionInstanceName] = functionInstance;
    logger.info("Function [" + functionInstanceName + "] was registered in global context.");
  }
};

//original: https://stackoverflow.com/a/36730872/3957754
var getJsFiles = function(currentWorkingDirectory, files) {
  fs.readdirSync(currentWorkingDirectory).forEach(function(file) {
    var subpath = currentWorkingDirectory + '/' + file;
    if (fs.lstatSync(subpath).isDirectory()) {
      if (subpath.includes("node_modules") || subpath.includes(".git") || subpath.includes("build")) {
        return;
      }
      getJsFiles(subpath, files);
    } else {
      var ext = path.extname(file);
      if (ext !== ".js") {
        return;
      }
      files.push(currentWorkingDirectory + '/' + file);
    }
  });
}


module.exports = JavascriptModulesDiscover;
