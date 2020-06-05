const Sensor = require("./sensor");

class Themometer extends Sensor {
	constructor() {
		super();

		this._temperature = 29.2;
		this._humidity = 12;

		setInterval(() => {
			this.update();
		}, 1500);
	}

	get temperature() {
		return this._temperature;
	}

	get humidity() {
		return this._humidity;
	}

	update() {
		this._simulateChanging();
		this.emit("update");
	}

	_simulateChanging() {
		this._temperature += Math.random() - 0.5;

		if (this._temperature > 36) {
			this._temperature = 36;
		}

		this._temperature = Math.round(this._temperature * 10) / 10;
		this._humidity += Math.random() - 0.5;

		if (this._humidity > 20) {
			this._humidity = 20;
		}

		this._humidity = Math.round(this._humidity * 10) / 10;
	}
}

const themometer = new Themometer();

module.exports = themometer;
