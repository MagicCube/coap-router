const Router = require("../../lib/router");
const router = Router();

const thermometer = require("../sensors/thermometer");

router.get("/", (req, res) => {
	res.json({
		temperature: thermometer.temperature,
		humidity: thermometer.humidity,
		timestamp: new Date().getTime()
	}).end();
});

router.observe("/", (req, res) => {
	function _onupdate() {
		res.json({
			temperature: thermometer.temperature,
			humidity: thermometer.humidity,
			timestamp: new Date().getTime()
		});
	}

	console.log("Start observing...");
	thermometer.on("update", _onupdate);
	res.on("finish", () => {
		thermometer.removeListener("update", _onupdate);
		console.log("End observing.");
	});
});

router.get("/temperature", (req, res) => {
	res.json({
		temperature: thermometer.temperature,
		timestamp: new Date().getTime()
	}).end();
});

router.get("/humidity", (req, res) => {
	res.json({
		humidity: thermometer.humidity,
		timestamp: new Date().getTime()
	}).end();
});

router.get("/:foo/:bar", (req, res) => {
	res.json(req.params).end();
});

module.exports = router;
