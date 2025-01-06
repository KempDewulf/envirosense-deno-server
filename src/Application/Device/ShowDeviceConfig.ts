import {
	DeviceQueryDto,
	DeviceQueryRepository,
	OutputPort,
	ShowDeviceConfigInput,
	ShowDeviceConfigOutput,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Messaging } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { NotFoundException } from "EnviroSense/Domain/mod.ts";

export class ShowDeviceConfig implements UseCase<ShowDeviceConfigInput> {
	private readonly _outputPort: OutputPort<ShowDeviceConfigOutput>;
	private readonly _deviceRepository: DeviceQueryRepository;
	private readonly _messaging: Messaging;

	constructor(
		outputPort: OutputPort<ShowDeviceConfigOutput>,
		deviceRepository: DeviceQueryRepository,
		messaging: Messaging,
	) {
		this._outputPort = outputPort;
		this._deviceRepository = deviceRepository;
		this._messaging = messaging;
	}

	async execute(input: ShowDeviceConfigInput): Promise<void> {
		const device = (await this._deviceRepository.find(input.deviceDocumentId))
			.orElseThrow(() => new NotFoundException(`Device with ID ${input.deviceDocumentId} not found.`));

		const { deviceConfig, failed } = await this.collectDeviceConfig(device);

		if (deviceConfig.size === 0) {
			throw new NotFoundException("Device did not respond with config");
		}

		const output = this.mapDtoToOutput(device, deviceConfig.get(device.identifier)!, failed);
		this._outputPort.present(output);
	}

	private async collectDeviceConfig(device: DeviceQueryDto): Promise<{
		deviceConfig: Map<string, Record<string, number | string>>;
		failed: boolean;
	}> {
		const deviceConfig = new Map<string, Record<string, number | string>>();
		let failed = false;

		try {
			const config = await this.requestDeviceConfig(device.identifier);
			deviceConfig.set(device.identifier, config);
		} catch (_error) {
			console.log(`❌ Error getting config for device ${device.identifier}`);
			failed = true;
		}

		return { deviceConfig, failed };
	}

	private async requestDeviceConfig(deviceId: string): Promise<Record<string, number | string>> {
		const requestTopic = `devices/${deviceId}/config/request`;
		const responseTopic = `devices/${deviceId}/config/response`;

		await this._messaging.publish(requestTopic, "{}");
		const response = await this._messaging.waitForMessage(responseTopic, 5000);

		if (!response) {
			throw new NotFoundException(`Device ${deviceId} did not respond in time`);
		}

		return JSON.parse(response);
	}

	private mapDtoToOutput(
		device: DeviceQueryDto,
		config: Record<string, number | string>,
		failed: boolean,
	): ShowDeviceConfigOutput {
		return {
			documentId: device.documentId,
			config,
			failed,
		};
	}
}
