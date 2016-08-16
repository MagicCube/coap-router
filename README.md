# coap-router
A quick demo on how to leverage web router to build [CoAP (Constrained Application Protocol)](https://en.wikipedia.org/wiki/Constrained_Application_Protocol) server.



## 1. Motivation
Currently I'm working on a Node.js based IoT (Internet of Things) platform. It allows Node.js powered DTU (Data Transfer Unit) to serve as CoAP server on smart devices like Raspberry PI.

When you design a Node.js based HTTP server, web router is one of your best choices to manage incoming requests from clients. Unfortunately, CoAP doesn't have one like Express Router, this project is to demonstrate how to leverage web router concept to simplify CoAP server implementation.



## 2.Usage

Inspired by many other JavaScript routers, `coap-router` does almost the same recursive routing as [Express.Router](http://expressjs.com/en/guide/routing.html).

Let's take a look at the example.

#### Example

##### ./server.js

```js
const coap = require("coap");
const app = require("./app");
const server = coap.createServer(app);
server.listen(() => {
    console.log("The CoAP server is now running.\n" + app.help);
});
```

##### ./app.js

```js
const Router = require("coap-router");
const app = Router();

app.get("/", (req, res) => {
    res.end("Hello, world");
});

app.use("/thermometer", require("./routes/thermometer"));
```


##### ./routes/thermometer.js
```js
const Router = require("../../lib/router");
const router = Router();
const thermometer = require("../sensors/thermometer");
router.get("/", (req, res) => {
    // route to "/thermometer/"
    writeJSON(res, {
        temperature: thermometer.temperature,
        humidity: thermometer.humidity,
        timestamp: new Date().getTime()
    });
    res.end();
});

router.get("/temperature", (req, res) => {
    // route to "/thermometer/temperature"
    writeJSON(res, {
        temperature: thermometer.temperature,
        timestamp: new Date().getTime()
    });
    res.end();
});
```



## 3. How to Install
### 3.1 Basic Requirements

* Node.js 6 or above
* UDP compatible network connected

### 3.2 Installation

```sh
$ npm install
```



## 4. How to Test

### 4.1 Install CoAP Client

Although there're dozens of CoAP clients available, one of the easiest ways is to install Node.js based client named `coap-cli`.

```sh
$ npm install coap-cli -g
$ coap
```

### 4.2 Tests

1. Start example server. By default the CoAP server is listening at port 5683.

   ```sh
   $ npm start
   ```

   ​

2. Get literal resource.

   ```sh
   $ coap coap://localhost/
   ```

   ​

3. Get JSON resource.

   ```sh
   $ coap coap://localhost/thermometer
   $ coap coap://localhost/thermometer/temperature
   $ coap coap://localhost/thermometer/humidity
   ```

4. Get the latest resource immediately after it has been changed (observing mode).

   ```sh
   $ coap coap://localhost/thermometer/ -o
   ```

   ​
