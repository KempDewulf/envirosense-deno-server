import { DomainException } from "EnviroSense/Domain/Shared/Exceptions/DomainException.ts";

export enum DeviceUiModeType {
    NORMAL = "normal",
    PPM = "ppm",
    TEMPERATURE = "temperature",
    HUMIDITY = "humidity"
}

export interface DeviceUiMode {
    type: DeviceUiModeType;
    validate(): void;
}

export class UiMode implements DeviceUiMode {
    constructor(public readonly type: DeviceUiModeType) {
        this.validate();
    }

    validate(): void {
        if (!Object.values(DeviceUiModeType).includes(this.type)) {
            throw new DomainException(`Invalid UI mode: ${this.type}`);
        }
    }
}
