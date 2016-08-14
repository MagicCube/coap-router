const Router = require("../../lib/router");
const router = Router();

const themometer = require("../sensors/thermometer");

router.get("/", (req, res) => {
    writeJSON(res, {
        temperature: themometer.temperature,
        humidity: themometer.humidity,
        timestamp: new Date().getTime()
    });
    res.end();
});

router.get("/temperature", (req, res) => {
    writeJSON(res, {
        temperature: themometer.temperature,
        timestamp: new Date().getTime()
    });
    res.end();
});

router.get("/humidity", (req, res) => {
    writeJSON(res, {
        humidity: themometer.humidity,
        timestamp: new Date().getTime()
    });
    res.end();
});




function writeJSON(res, json)
{
    res.setOption("Content-Format", "application/json");
    res.write(JSON.stringify(json));
}

module.exports = router;
