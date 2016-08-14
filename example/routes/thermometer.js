const Router = require("../../lib/router");
const router = Router();

const themometer = require("../sensors/thermometer");

router.get("/", (req, res) => {
    writeJSON(res);
    res.end();
});

router.get("/temperature", (req, res) => {
    res.end(themometer);
});




function writeJSON(res, json)
{
    res.setOption("Content-Format", "application/json");
    res.write(JSON.stringify({
        temperature: themometer.temperature,
        humidity: themometer.humidity,
    }));
}

module.exports = router;
