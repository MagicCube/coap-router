const URL = require("url");
const pathRegexp = require("path-to-regexp");

const METHODS = ["all", "get", "observe", "post", "put", "delete"];

function decode_param(val) {
    if (typeof val !== "string" || val.length === 0) {
        return val;
    }
    try {
        return decodeURIComponent(val);
    } catch (err) {
        if (err instanceof URIError) {
            err.message = "Failed to decode param \"" + val + "\"";
            err.status = err.statusCode = 400;
        }
        throw err;
    }
}

function getMatchParams(match, keys) {
    const params = {};
    for (let i = 1; i < match.length; i++) {
        const key = keys[i - 1];
        const prop = key.name;
        const val = decode_param(match[i]);
        if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
            params[prop] = val;
        }
    }
    return params;
}

module.exports = function router() {
    const handlers = [];
    const router = function router(req, res, next) {
        const url = URL.parse(req.url);
        const path = url.path;
        let method = req.method.toLowerCase();
        if (method === "get" && req.headers["Observe"] === 0) {
            method = "observe";
        }

        const handlersCloned = handlers.slice(0);

        function findAndExecuteNextHandler() {
            let result;
            while (true) {
                const handler = handlersCloned.shift();
                // no more handlers left
                if (!handler) break;
                // method not matching
                if (handler.method !== "all" && handler.method !== method) continue;
                // build absolute handler path
                let handlerPath = handler.path;
                if (router.basePath) {
                    handlerPath = router.basePath;
                    if (handler.path !== "/") {
                        handlerPath += handler.path;
                    }
                }
                // check for sub-router
                if (handler.callback.isRouter && path.startsWith(handlerPath)) {
                    result = handler;
                    break;
                }
                // match url with parameters
                const keys = [];
                const regexp = pathRegexp(handlerPath, keys);
                const match = regexp.exec(path);
                // url does not match
                if (!match) continue;
                // build params object
                req.params = getMatchParams(match, keys);
                req.handled = true;
                result = handler;
                break;
            }

            if (result) {
                result.callback(req, res, findAndExecuteNextHandler);
            } else {
                if (typeof (next) === "function") {
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
        if (typeof (callback) !== "function") {
            throw new Error("Callback must be a function.");
        }
        if (path !== "" && !path.startsWith("/")) {
            throw new Error("Path must starts with '/'.");
        }
        handlers.push({
            method,
            path,
            callback
        });
        return this;
    };

    METHODS.forEach(method => {
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
