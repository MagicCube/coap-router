const coap = require("coap");
const app = require("./app");

const server = coap.createServer(app);

server.listen(() => {
	console.log("The CoAP server is now running.\n" + app.help);
});
