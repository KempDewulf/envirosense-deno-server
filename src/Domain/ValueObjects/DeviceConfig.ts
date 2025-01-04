import { DomainException } from "EnviroSense/Domain/Shared/Exceptions/DomainException.ts";

export enum DeviceConfigType {
    UI_MODE = "ui-mode",
    BRIGHTNESS = "brightness"
}

export enum DeviceUiModeType {
    NORMAL = "normal",
    PPM = "ppm",
    TEMPERATURE = "temperature",
    HUMIDITY = "humidity"
}

export interface DeviceConfigValue {
    type: DeviceConfigType;
    value: string | number;
    validate(): void;
}

export class ConfigValue implements DeviceConfigValue {
    constructor(
        public readonly type: DeviceConfigType,
        public readonly value: string | number
    ) {
        this.validate();
    }

    validate(): void {
        switch (this.type) {
            case DeviceConfigType.BRIGHTNESS:
                if (typeof this.value !== "number" || this.value < 20 || this.value > 100) {
                    throw new DomainException("Brightness must be between 20 and 100");
                }
                break;
            case DeviceConfigType.UI_MODE:
                if (!Object.values(DeviceUiModeType).includes(this.value as DeviceUiModeType)) {
                    throw new DomainException(`Invalid UI mode: ${this.value}`);
                }
                break;
            default:
                throw new DomainException(`Unsupported config type: ${this.type}`);
        }
    }
}
