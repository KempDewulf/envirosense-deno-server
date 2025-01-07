import {
	DeviceRepository,
	OutputPort,
	UpdateDeviceLimitInput,
	UpdateDeviceLimitOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Device, DeviceLimit, DeviceLimitType, TemperatureLimit } from "EnviroSense/Domain/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { DeviceNotFoundError } from "EnviroSense/Infrastructure/Shared/Errors/DeviceNotFoundError.ts";

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

	public async execute(input: UpdateDeviceLimitInput): Promise<void> {
		const device = (await this._deviceRepository.find(input.deviceDocumentId)).orElseThrow(() =>
			new DeviceNotFoundError(input.deviceDocumentId)
		);

		const limit = this.createLimit(input.limitType, input.value);
		device.updateLimit(limit);

		await this.publishMessage(device, input, limit);

		const output: UpdateDeviceLimitOutput = {
			documentId: device.documentId,
			limitType: limit.type,
			value: limit.value,
		};

		this._outputPort.present(output);
	}

	private createLimit(type: string, value: number): DeviceLimit {
		switch (type.toLowerCase()) {
			case DeviceLimitType.TEMPERATURE:
				return new TemperatureLimit(DeviceLimitType.TEMPERATURE, value);
			default:
				throw new Error(`Unsupported limit type: ${type}`);
		}
	}

	private async publishMessage(device: Device, input: UpdateDeviceLimitInput, limit: DeviceLimit): Promise<void> {
		// Publish limit update to IoT device
		const topic = `devices/${device.identifier}/limits/${input.limitType}`;
		const message = JSON.stringify({
			type: limit.type,
			value: limit.value,
		});

		await this._messaging.publish(topic, message);
	}
}
