import { DomainException } from "EnviroSense/Domain/Shared/Exceptions/DomainException.ts";

export enum DeviceLimitType {
    TEMPERATURE = "temperature",
    HUMIDITY = "humidity",
    PPM = "ppm",
    LIGHT = "light",
}

export interface DeviceLimit {
    type: DeviceLimitType;
    value: number;
    validate(): void;
}

export class TemperatureLimit implements DeviceLimit {
    constructor(
        public readonly type: DeviceLimitType.TEMPERATURE,
        public readonly value: number
    ) {
        this.validate();
    }

    validate(): void {
        if (this.value < 0 || this.value > 80) {
            throw new DomainException("Temperature must be between 0 and 80°C");
        }
    }
}
