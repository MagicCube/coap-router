"use strict";

var URL = require("url");

var querystring = require("querystring");

var pathToRegexp = require("path-to-regexp");

var METHODS = ["all", "get", "observe", "post", "put", "delete"];

module.exports = function () {
  var handlers = [];

  var router = function router(req, res, next) {
    var url = URL.parse(req.url);
    var path = url.pathname; // Parse url query parameter and append to req

    req.query = querystring.parse(url.query); // Convenient helper method for JSON response

    res.json = function (json) {
      res.setOption("Content-Format", "application/json");
      res.write(JSON.stringify(json));
      return res;
    };

    var method = req.method.toLowerCase();

    if (method === "get" && req.headers["Observe"] === 0) {
      method = "observe";
    }

    var handlersCloned = handlers.slice(0);

    function findAndExecuteNextHandler() {
      var result = undefined;

      while (result === undefined) {
        var handler = handlersCloned.shift();

        if (handler) {
          if (handler.method === "all" || handler.method === method) {
            var _ret = function () {
              var handlerPath = null;

              if (router.basePath) {
                if (handler.path === "/") {
                  handlerPath = router.basePath;
                } else {
                  handlerPath = router.basePath + handler.path;
                }
              } else {
                handlerPath = handler.path;
              }

              if (handler.callback.isRouter) {
                if (path.startsWith(handlerPath)) {
                  req.handled = true;
                  result = handler;
                  return "break";
                }
              }

              var keys = [];
              var re = pathToRegexp(handlerPath, keys);
              var matches = re.exec(path);

              if (matches) {
                if (matches.length > 1) {
                  req.params = {};
                  keys.forEach(function (key, idx) {
                    req.params[key.name] = matches[idx + 1];
                  });
                }

                req.handled = true;
                result = handler;
                return "break";
              }
            }();

            if (_ret === "break") break;
          }
        } else {
          break;
        }
      }

      if (result) {
        result.callback(req, res, findAndExecuteNextHandler);
      } else {
        if (typeof next === "function") {
          next();
        } else {
          if (!req.handled) {
            // 404 - Not found
            res.code = 404;
            res.end();
          }
        }
      }
    }

    findAndExecuteNextHandler();
  };

  router.isRouter = true;

  router.method = function (method, path, callback) {
    method = method.toLowerCase();

    if (METHODS.indexOf(method) === -1) {
      throw new Error("In CoAP protocol, method only accepts GET, POST, PUT and DELETE.");
    }

    if (typeof callback !== "function") {
      throw new Error("Callback must be a function.");
    }

    if (path !== "" && !path.startsWith("/")) {
      throw new Error("Path must starts with '/'.");
    }

    handlers.push({
      method: method,
      path: path,
      callback: callback
    });
    return this;
  };

  METHODS.forEach(function (method) {
    router[method] = function (path, callback) {
      return router.method(method, path, callback);
    };
  });

  router.use = function (path, subRouter) {
    subRouter.basePath = (router.basePath ? router.basePath : "") + path;
    this.all(path, subRouter);
  };

  return router;
};
