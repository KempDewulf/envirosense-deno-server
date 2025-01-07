import {
	DeviceRepository,
	OutputPort,
	UpdateDeviceConfigInput,
	UpdateDeviceConfigOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { ConfigValue, DeviceConfigType, DeviceUiModeType } from "EnviroSense/Domain/mod.ts";
import { DeviceNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/DeviceNotFoundError.ts";

export class UpdateDeviceConfig implements UseCase<UpdateDeviceConfigInput> {
	private readonly _outputPort: OutputPort<UpdateDeviceConfigOutput>;
	private readonly _deviceRepository: DeviceRepository;
	private readonly _messaging: Messaging;

	constructor(
		outputPort: OutputPort<UpdateDeviceConfigOutput>,
		deviceRepository: DeviceRepository,
		messaging: Messaging,
	) {
		this._outputPort = outputPort;
		this._deviceRepository = deviceRepository;
		this._messaging = messaging;
	}

	public async execute(input: UpdateDeviceConfigInput): Promise<void> {
		const device = (await this._deviceRepository.find(input.deviceDocumentId)).orElseThrow(() =>
			new DeviceNotFoundError(input.deviceDocumentId)
		);

		const configType = input.configType as DeviceConfigType;
		const config = new ConfigValue(configType, input.value);

		switch (configType) {
			case DeviceConfigType.UI_MODE:
				device.updateUiMode(input.value as DeviceUiModeType);
				break;
			case DeviceConfigType.BRIGHTNESS:
				device.updateBrightness(input.value as number);
				break;
		}

		const topic = `devices/${device.identifier}/config/${configType}`;
		const message = JSON.stringify(
			{ type: config.type, value: config.value },
		);

		await this._messaging.publish(topic, message);

		const output: UpdateDeviceConfigOutput = {
			documentId: device.documentId,
			configType: configType,
			value: config.value,
		};

		this._outputPort.present(output);
	}
}
