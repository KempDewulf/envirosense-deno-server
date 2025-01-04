import {
	DeviceRepository,
	OutputPort,
	UpdateDeviceBrightnessInput,
	UpdateDeviceBrightnessOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { Brightness } from "EnviroSense/Domain/mod.ts";

export class UpdateDeviceBrightness implements UseCase<UpdateDeviceBrightnessInput> {
	private readonly _outputPort: OutputPort<UpdateDeviceBrightnessOutput>;
	private readonly _deviceRepository: DeviceRepository;
	private readonly _messaging: Messaging;

	constructor(
		outputPort: OutputPort<UpdateDeviceBrightnessOutput>,
		deviceRepository: DeviceRepository,
		messaging: Messaging,
	) {
		this._outputPort = outputPort;
		this._deviceRepository = deviceRepository;
		this._messaging = messaging;
	}

	public async execute(input: UpdateDeviceBrightnessInput): Promise<void> {
		const deviceOptional = await this._deviceRepository.find(input.deviceDocumentId);
		const device = deviceOptional.orElseThrow(
			() => new Error(`Device with ID ${input.deviceDocumentId} not found.`),
		);

		const brightness = new Brightness(input.value);
		device.updateBrightness(brightness);

		const topic = `devices/${device.identifier}/config/brightness`;
		const message = JSON.stringify({
			value: brightness.value,
		});

		await this._messaging.publish(topic, message);

		const output: UpdateDeviceBrightnessOutput = {
			documentId: device.documentId,
			value: brightness.value,
		};

		this._outputPort.present(output);
	}
}
