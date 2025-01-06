import {
	DeviceDataQueryDto,
	DeviceDataRepository,
	DeviceRepository,
	RemoveDeviceFromRoomInput,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceOperation } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Room/RoomStrapiRepository.ts";
import { DeviceDataStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { DeviceData } from "EnviroSense/Domain/mod.ts";

export class RemoveDeviceFromRoom implements UseCase<RemoveDeviceFromRoomInput> {
	private readonly _roomRepository: RoomRepository;
	private readonly _deviceRepository: DeviceRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;

	constructor(
		roomRepository: RoomRepository,
		deviceRepository: DeviceRepository,
		deviceDataRepository: DeviceDataRepository,
	) {
		this._roomRepository = roomRepository;
		this._deviceRepository = deviceRepository;
		this._deviceDataRepository = deviceDataRepository;
	}

	async execute(input: RemoveDeviceFromRoomInput): Promise<void> {
		try {
			const roomOptional = await this._roomRepository.find(
				input.roomDocumentId,
			);

			const room = roomOptional.orElseThrow(
				() => new Error(`Room with ID ${input.roomDocumentId} not found.`),
			);

			const deviceOptional = await this._deviceRepository.find(
				input.deviceDocumentId,
			);

			const device = deviceOptional.orElseThrow(
				() =>
					new Error(
						`Device with documentId ${input.deviceDocumentId} not found.`,
					),
			);

			const deviceData = await new DeviceDataStrapiQueryRepository().all(
				device.identifier,
			);

			const deletePromises = deviceData.map((data: DeviceDataQueryDto) => {
				const deviceDataEntity = DeviceData.create(
					data.documentId,
					data.device,
					data.timestamp,
					data.airData,
				);

				return this._deviceDataRepository
					.deleteEntity(deviceDataEntity)
					.catch((error) => {
						console.error(
							`Failed to delete data ${data.documentId}: ${error.message}`,
						);
						throw new Error(
							`Failed to delete device data ${data.documentId}`,
						);
					});
			});

			await Promise.all(deletePromises);

			room.removeDevice(device.documentId);

			await this._roomRepository.manageDevices(
				room.documentId,
				[input.deviceDocumentId],
				DeviceOperation.REMOVE,
			);

			device.deviceData = [];
		} catch (_error) {
			throw new Error(`Failed to remove device from room`);
		}
	}
}
