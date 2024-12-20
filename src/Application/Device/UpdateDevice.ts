import { DeviceRepository, OutputPort, UpdateDeviceInput, UpdateDeviceOutput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

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
		const deviceOptional = await this._deviceRepository.find(
			input.deviceDocumentId,
		);

		const device = deviceOptional.orElseThrow(
			() =>
				new Error(
					`Device with ID ${input.deviceDocumentId} not found.`,
				),
		);

		if (input.identifier !== undefined) {
			device.updateIdentifier(input.identifier);
		}

		await this._deviceRepository.update(device);

		const output: UpdateDeviceOutput = {
			id: device.id,
			identifier: device.identifier,
		};

		this._outputPort.present(output);
	}
}
