const Router = require("../../lib/router");
const router = Router();

const thermometer = require("../sensors/thermometer");

router.get("/", (req, res) => {
    writeJSON(res, {
        temperature: thermometer.temperature,
        humidity: thermometer.humidity,
        timestamp: new Date().getTime()
    });
    res.end();
});

router.observe("/", (req, res) => {
    function _onupdate() {
        writeJSON(res, {
            temperature: thermometer.temperature,
            humidity: thermometer.humidity,
            timestamp: new Date().getTime()
        });
    }

    console.log("Start observing...");
    thermometer.on("update", _onupdate);
    res.on("finish", err => {
        thermometer.removeListener("update", _onupdate);
        console.log("End observing.");
    });
});

router.get("/:property", (req, res) => {
    const { property } = req.params;
    if (property !== "temperature" && property !== "humidity") {
        res.code = 404;
        res.end();
    }
    writeJSON(res, {
        temperature: thermometer[property],
        timestamp: new Date().getTime()
    });
    res.end();
});


function writeJSON(res, json) {
    res.setOption("Content-Format", "application/json");
    res.write(JSON.stringify(json));
}

module.exports = router;
