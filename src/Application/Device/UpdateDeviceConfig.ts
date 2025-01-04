import {
	DeviceRepository,
	OutputPort,
	UpdateDeviceConfigInput,
	UpdateDeviceConfigOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { Brightness, ConfigValue, DeviceConfigType, DeviceUiModeType, UiMode } from "EnviroSense/Domain/mod.ts";

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
		const deviceOptional = await this._deviceRepository.find(input.deviceDocumentId);
		const device = deviceOptional.orElseThrow(
			() => new Error(`Device with ID ${input.deviceDocumentId} not found.`),
		);

		const configType = input.configType as DeviceConfigType;
		const config = new ConfigValue(configType, input.value);

		switch (configType) {
			case DeviceConfigType.UI_MODE:
				device.updateUiMode(new UiMode(input.value as DeviceUiModeType));
				break;
			case DeviceConfigType.BRIGHTNESS:
				device.updateBrightness(new Brightness(input.value as number));
				break;
		}

		const topic = `devices/${device.identifier}/config/${configType}`;
		const message = JSON.stringify({ value: config.value });

		await this._messaging.publish(topic, message);

		const output: UpdateDeviceConfigOutput = {
			documentId: device.documentId,
			configType: configType,
			value: config.value,
		};

		this._outputPort.present(output);
	}
}
