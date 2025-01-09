import { DeviceRepository, OutputPort, UpdateDeviceInput, UpdateDeviceOutput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class UpdateDevice implements UseCase<UpdateDeviceInput> {
	private readonly _outputPort: OutputPort<UpdateDeviceOutput>;
	private readonly _deviceRepository: DeviceRepository;

	constructor(
		outputPort: OutputPort<UpdateDeviceOutput>,
		deviceRepository: DeviceRepository,
	) {
		this._outputPort = outputPort;
		this._deviceRepository = deviceRepository;
	}

	public async execute(input: UpdateDeviceInput): Promise<void> {
		const device = (await this._deviceRepository.find(input.deviceDocumentId)).orElseThrow(() =>
			new DeviceNotFoundError(input.deviceDocumentId)
		);

		if (input.identifier !== undefined) {
			device.updateIdentifier(input.identifier);
		}

		await this._deviceRepository.update(device);

		const output: UpdateDeviceOutput = {
			documentId: device.documentId,
			identifier: device.identifier,
		};

		this._outputPort.present(output);
	}
}
