import { DeviceRepository, OutputPort, UpdateDeviceLimitInput, UpdateDeviceLimitOutput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceLimit, DeviceLimitType, TemperatureLimit } from "EnviroSense/Domain/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class UpdateDeviceLimit implements UseCase<UpdateDeviceLimitInput> {
	private readonly _outputPort: OutputPort<UpdateDeviceLimitOutput>;
	private readonly _deviceRepository: DeviceRepository;
	private readonly _messaging: Messaging;

	constructor(
		outputPort: OutputPort<UpdateDeviceLimitOutput>,
		deviceRepository: DeviceRepository,
		messaging: Messaging,
	) {
		this._outputPort = outputPort;
		this._deviceRepository = deviceRepository;
		this._messaging = messaging;
	}

	private createLimit(type: string, value: number): DeviceLimit {
		switch (type.toLowerCase()) {
			case DeviceLimitType.TEMPERATURE:
				return new TemperatureLimit(DeviceLimitType.TEMPERATURE, value);
			default:
				throw new Error(`Unsupported limit type: ${type}`);
		}
	}

	public async execute(input: UpdateDeviceLimitInput): Promise<void> {
		const deviceOptional = await this._deviceRepository.find(input.deviceDocumentId);
		const device = deviceOptional.orElseThrow(
			() => new Error(`Device with ID ${input.deviceDocumentId} not found.`),
		);

		const limit = this.createLimit(input.limitType, input.value);
		device.updateLimit(limit);

		// Publish limit update to IoT device
		const topic = `devices/${device.identifier}/limits/${input.limitType}`;
		const message = JSON.stringify({
			type: limit.type,
			value: limit.value,
		});

		await this._messaging.publish(topic, message);
		const output: UpdateDeviceLimitOutput = {
			documentId: device.documentId,
			limitType: limit.type,
			value: limit.value,
		};

		this._outputPort.present(output);
	}
}
