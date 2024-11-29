import { Device, Guid } from "EnviroSense/Domain/mod.ts";

export interface DeviceDataState {
    id: Guid;
    device: Device;
    timestamp: Date;
    temperature: number;
    humidity: number;
    gasPpm: number;
}

export class DeviceData {
    private readonly _id: Guid;
    private readonly _device: Device;
    private readonly _timestamp: Date;
    private readonly _temperature: number;
    private readonly _humidity: number;
    private readonly _gasPpm: number;

    private constructor(
        id: Guid,
        device: Device,
        timestamp: Date,
        temperature: number,
        humidity: number,
        gasPpm: number
    ) {
        this._id = id;
        this._device = device;
        this._timestamp = timestamp;
        this._temperature = temperature;
        this._humidity = humidity;
        this._gasPpm = gasPpm;
    }

    static create(
        device: Device,
        timestamp: Date,
        temperature: number,
        humidity: number,
        gasPpm: number
    ): DeviceData {
        const deviceData = new DeviceData(
            Guid.create(),
            device,
            timestamp,
            temperature,
            humidity,
            gasPpm
        );
        deviceData.validateState();

        return deviceData;
    }

    static load(state: DeviceDataState): DeviceData {
        const deviceData = new DeviceData(
            state.id,
            state.device,
            state.timestamp,
            state.temperature,
            state.humidity,
            state.gasPpm
        );
        deviceData.validateState();

        return deviceData;
    }

    public validateState() {
        this.ensureDeviceIsNotEmpty();
        this.ensureTimestampIsNotEmpty();
        this.ensureTemperatureIsNotEmpty();
        this.ensureHumidityIsNotEmpty();
        this.ensureGasPpmIsNotEmpty();
    }

    private ensureDeviceIsNotEmpty() {
        if (!this._device) {
            throw new Error("Device is required");
        }
    }

    private ensureTimestampIsNotEmpty() {
        if (!this._timestamp) {
            throw new Error("Timestamp is required");
        }
    }

    private ensureTemperatureIsNotEmpty() {
        if (!this._temperature) {
            throw new Error("Temperature is required");
        }
    }

    private ensureHumidityIsNotEmpty() {
        if (!this._humidity) {
            throw new Error("Humidity is required");
        }
    }

    private ensureGasPpmIsNotEmpty() {
        if (!this._gasPpm) {
            throw new Error("Gas PPM is required");
        }
    }

    get id() {
        return this._id;
    }

    get device() {
        return this._device;
    }

    get timestamp() {
        return this._timestamp;
    }

    get temperature() {
        return this._temperature;
    }

    get humidity() {
        return this._humidity;
    }

    get gasPpm() {
        return this._gasPpm;
    }
}
