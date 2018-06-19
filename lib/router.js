const URL = require("url");

const METHODS = ["all", "get", "observe", "post", "put", "delete"];

module.exports = function router()
{
    const handlers = [];
    const router = function(req, res, next) {
        const url = URL.parse(req.url);
        const path = url.path;
        let method = req.method.toLowerCase();
        if (method === "get" && req.headers['Observe'] === 0)
        {
            method = "observe";
        }

        const handlersCloned = handlers.slice(0);
        function findAndExecuteNextHandler()
        {
            let result = undefined;
            while (result === undefined)
            {
                const handler = handlersCloned.shift();
                if (handler)
                {
                    if (handler.method === "all" || handler.method === method)
                    {
                        let handlerPath = null;
                        if (router.basePath)
                        {
                            if (handler.path === "/")
                            {
                                handlerPath = router.basePath;
                            }
                            else
                            {
                                handlerPath = router.basePath + handler.path;
                            }
                        }
                        else
                        {
                            handlerPath = handler.path;
                        }

                        if (handler.callback.isRouter)
                        {
                            if (path.startsWith(handlerPath))
                            {
                                req.handled = true;
                                result = handler;
                                break;
                            }
                        }
                        if (path === handlerPath)
                        {
                            req.handled = true;
                            result = handler;
                            break;
                        }
                    }
                }
                else
                {
                    break;
                }
            }

            if (result)
            {
                result.callback(req, res, findAndExecuteNextHandler);
            }
            else
            {
                if (typeof(next) === "function")
                {
                    next();
                }
                else
                {
                    if (!req.handled)
                    {
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



    router.method = function(method, path, callback)
    {
        method = method.toLowerCase();
        if (METHODS.indexOf(method) === -1)
        {
            throw new Error(`In CoAP protocol, method only accepts GET, POST, PUT and DELETE.`);
        }
        if (typeof(callback) !== "function")
        {
            throw new Error("Callback must be a function.");
        }
        if (path !== "" && !path.startsWith("/"))
        {
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
        router[method] = function(path, callback)
        {
            return router.method(method, path, callback);
        };
    });


    router.use = function(path, subRouter)
    {
        subRouter.basePath = (router.basePath ? router.basePath : "") + path;
        subRouter.isRouter = true;
        this.all(path, subRouter);
    };

    return router;
};
