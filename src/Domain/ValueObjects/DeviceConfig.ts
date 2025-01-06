import { DomainException } from "EnviroSense/Domain/Shared/Exceptions/DomainException.ts";
import { DeviceUiModeType } from "EnviroSense/Domain/mod.ts";

export enum DeviceConfigType {
	UI_MODE = "ui-mode",
	BRIGHTNESS = "brightness",
}

export interface DeviceConfigValue {
	type: DeviceConfigType;
	value: string | number;
	validate(): void;
}

export class ConfigValue implements DeviceConfigValue {
	constructor(
		public readonly type: DeviceConfigType,
		public readonly value: string | number,
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

export class DeviceConfig {
	private _values: Map<DeviceConfigType, ConfigValue>;

	private constructor() {
		this._values = new Map();
	}

	static create(): DeviceConfig {
		const config = new DeviceConfig();
		// Set defaults
		config.setBrightness(80);
		config.setUiMode(DeviceUiModeType.NORMAL);
		return config;
	}

	static load(values: ConfigValue[]): DeviceConfig {
		const config = new DeviceConfig();
		values.forEach((value) => {
			config._values.set(value.type, value);
		});
		return config;
	}

	setBrightness(value: number): void {
		this._values.set(
			DeviceConfigType.BRIGHTNESS,
			new ConfigValue(DeviceConfigType.BRIGHTNESS, value),
		);
	}

	setUiMode(value: DeviceUiModeType): void {
		this._values.set(
			DeviceConfigType.UI_MODE,
			new ConfigValue(DeviceConfigType.UI_MODE, value),
		);
	}

	getValue(type: DeviceConfigType): ConfigValue | undefined {
		return this._values.get(type);
	}

	getValues(): ConfigValue[] {
		return Array.from(this._values.values());
	}
}
