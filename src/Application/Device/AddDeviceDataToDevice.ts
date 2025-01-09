import { AddDeviceDataToDeviceInput, DeviceDataRepository, DeviceRepository, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceDataNotFoundError, DeviceNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceDataOperation } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export class AddDeviceDataToDevice implements UseCase<AddDeviceDataToDeviceInput> {
	private readonly _deviceRepository: DeviceRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;

	constructor(
		deviceRepository: DeviceRepository,
		deviceDataRepository: DeviceDataRepository,
	) {
		this._deviceRepository = deviceRepository;
		this._deviceDataRepository = deviceDataRepository;
	}

	async execute(input: AddDeviceDataToDeviceInput): Promise<void> {
		const device = (await this._deviceRepository.find(input.deviceDocumentId)).orElseThrow(() =>
			new DeviceNotFoundError(input.deviceDocumentId)
		);

		const deviceDataDocumentIdsToConnect: string[] = [];

		for (const deviceDataDocumentId of input.device_data) {
			const deviceData = (await this._deviceDataRepository.find(deviceDataDocumentId)).orElseThrow(() =>
				new DeviceDataNotFoundError(deviceDataDocumentId)
			);

			device.addDeviceData(deviceData);

			deviceDataDocumentIdsToConnect.push(deviceData.documentId);
		}

		await this._deviceRepository.manageDeviceData(
			device.documentId,
			deviceDataDocumentIdsToConnect,
			DeviceDataOperation.ADD,
		);
	}
}
