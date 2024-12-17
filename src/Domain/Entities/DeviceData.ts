import { Device } from "EnviroSense/Domain/mod.ts";
import { AirData } from "EnviroSense/Domain/mod.ts";

export interface DeviceDataState {
	id: string;
	device: Device;
	timestamp: Date;
	airData: AirData;
}

export class DeviceData {
	private readonly _id: string;
	private readonly _device: Device;
	private readonly _timestamp: Date;
	private readonly _airData: AirData;

	private constructor(
		id: string,
		device: Device,
		timestamp: Date,
		airData: AirData,
	) {
		this._id = id;
		this._device = device;
		this._timestamp = timestamp;
		this._airData = airData;
	}

	static create(
		id: string,
		device: Device,
		timestamp: Date,
		airData: AirData,
	): DeviceData {
		const deviceData = new DeviceData(
			id,
			device,
			timestamp,
			airData,
		);
		deviceData.validateState();

		return deviceData;
	}

	static load(state: DeviceDataState): DeviceData {
		const deviceData = new DeviceData(
			state.id,
			state.device,
			state.timestamp,
			state.airData,
		);
		deviceData.validateState();

		return deviceData;
	}

	public validateState(): void {
		this.ensureTimestampIsNotEmpty();
		this.ensureAirDataIsValid();
	}

	private ensureTimestampIsNotEmpty(): void {
		if (!this._timestamp) {
			throw new Error("Timestamp is required");
		}
	}

	private ensureAirDataIsValid(): void {
		if (!this._airData) {
			throw new Error("AirData is required");
		}

		const { temperature, humidity, ppm } = this._airData;

		if (temperature == null) {
			throw new Error("Temperature is required in AirData");
		}
		if (humidity == null) {
			throw new Error("Humidity is required in AirData");
		}
		if (ppm == null) {
			throw new Error("PPM is required in AirData");
		}
	}

	get id(): string {
		return this._id;
	}

	get device(): Device {
		return this._device;
	}

	get timestamp(): Date {
		return this._timestamp;
	}

	get airData(): AirData {
		return this._airData;
	}
}
