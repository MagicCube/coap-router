const Sensor = require("./sensor");

class Themometer extends Sensor
{
    constructor()
    {
        this._temperature = 29.2;
        this._humidity = 12;
        setInterval(() => {
            this.update();
        }, 1500);
    }

    get temperature()
    {
        return this._temperature;
    }

    get humidity()
    {
        return this._humidity;
    }

    update()
    {
        this._temperature += Math.random() - 0.5;
        if (this._temperature > 36)
        {
            this._temperature = 36;
        }
        this._temperature = Math.round(this._temperature * 10) / 10;

        this._humidity += Math.random() - 0.5;
        if (this._humidity > 20)
        {
            this._humidity = 20;
        }
        this._humidity = Math.round(_humidity * 10) / 10;

        this.emit("update");
    }
}

const themometer = new Themometer();
module.exports = themometer;
