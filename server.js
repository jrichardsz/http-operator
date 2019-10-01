const util = require('util')
var express  = require('express');
var app      = express();
var httpProxy = require('http-proxy');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var uuid = require('uuid');
var oauth;
var fs = require('fs');
var cors = require('cors');
const port = process.env.PORT || 8080;
const path = require('path');

const logger = require('./common/log/Logger.js');

global.rootHomePath = path.resolve(__dirname);
global.logger = logger;

app.use(cookieParser())

app.use(session({
  secret: uuid.v4(),
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: (45 * 60 * 1000)
  }
}));

app.use(cors());

const JavascriptModulesDiscover = require('./common/advanced/injection/JavascriptModulesDiscover.js');
JavascriptModulesDiscover.scan(["server.js"]);

routesEnvironmentReader.saveRoutesAsGlobal();

propertiesDiscovery.registerFromJsonFile("application.json","utf8");

app.get('/health', function(req, res) {

   var status = {
     "status":"200"
   };

   res.json(status);
});

app.all("*", function(req, res) {
  httpProxyHelper.performSimpleProxy(req,res);
});

app.listen(port, () => {
    logger.info("Proxy server listening at "+port);
});
