import { DeleteAllDeviceDataFromDeviceInput, DeviceDataRepository, DeviceRepository, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteAllDeviceDataFromDevice implements UseCase<DeleteAllDeviceDataFromDeviceInput> {
	private readonly _deviceRepository: DeviceRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;

	constructor(
		deviceRepository: DeviceRepository,
		deviceDataRepository: DeviceDataRepository,
	) {
		this._deviceRepository = deviceRepository;
		this._deviceDataRepository = deviceDataRepository;
	}

	public async execute(input: DeleteAllDeviceDataFromDeviceInput): Promise<void> {
		const device = (await this._deviceRepository.find(input.deviceDocumentId))
			.orElseThrow(() =>
				new Error(
					`Device with ID ${input.deviceDocumentId} not found.`,
				)
			);

		const deviceData = device.deviceData;

		deviceData.forEach(async (deviceData) => {
			await this._deviceDataRepository.deleteEntity(deviceData);
		});

		device.deviceData = [];
	}
}
