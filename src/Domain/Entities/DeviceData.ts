import { AirData, Device } from "EnviroSense/Domain/mod.ts";

export interface DeviceDataState {
	documentId: string;
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
		documentId: string,
		device: Device,
		timestamp: Date,
		airData: AirData,
	) {
		this._id = documentId;
		this._device = device;
		this._timestamp = timestamp;
		this._airData = airData;
	}

	static create(
		documentId: string,
		device: Device,
		timestamp: Date,
		airData: AirData,
	): DeviceData {
		const deviceData = new DeviceData(
			documentId,
			device,
			timestamp,
			airData,
		);
		deviceData.validateState();

		return deviceData;
	}

	static load(state: DeviceDataState): DeviceData {
		const deviceData = new DeviceData(
			state.documentId,
			state.device,
			state.timestamp,
			state.airData,
		);
		deviceData.validateState();

		return deviceData;
	}

	public validateState(): void {
		this.ensureTimestampIsNotEmpty();
		this.ensureDeviceIsNotEmpty();
		this.ensureAirDataIsValid();
	}

	private ensureTimestampIsNotEmpty(): void {
		if (!this._timestamp) {
			throw new Error("Timestamp is required.");
		}
	}

	private ensureDeviceIsNotEmpty(): void {
		if (!this._device) {
			throw new Error("Device is required.");
		}
	}

	private ensureAirDataIsValid(): void {
		if (!this._airData) {
			throw new Error("AirData is required.");
		}

		const { temperature, humidity, ppm } = this._airData;

		if (temperature == null) {
			throw new Error("Temperature is required. in AirData");
		}
		if (humidity == null) {
			throw new Error("Humidity is required. in AirData");
		}
		if (ppm == null) {
			throw new Error("PPM is required. in AirData");
		}

		if (humidity < 0 || humidity > 100) {
			throw new Error("Humidity must be between 0 and 100");
		}
		if (ppm < 0 || ppm > 5000) {
			throw new Error("PPM must be between 0 and 5000");
		}
	}

	get documentId(): string {
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
