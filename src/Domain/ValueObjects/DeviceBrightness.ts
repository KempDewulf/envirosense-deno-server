import { DomainException } from "EnviroSense/Domain/Shared/Exceptions/DomainException.ts";

export interface DeviceBrightness {
    value: number;
    validate(): void;
}

export class Brightness implements DeviceBrightness {
    constructor(public readonly value: number) {
        this.validate();
    }

    validate(): void {
        if (this.value <= 0 || this.value >= 100) {
            throw new DomainException(`Invalid brightness value: ${this.value}`);
        }
    }
}
