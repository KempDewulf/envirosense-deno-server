import {
	DeviceDataRepository,
	DeviceRepository,
	RemoveDeviceFromRoomInput,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceOperation } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Room/RoomStrapiRepository.ts";

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
			const roomOptional = await this._roomRepository.find(input.roomDocumentId);

			const room = roomOptional.orElseThrow(
				() => new Error(`Room with ID ${input.roomDocumentId} not found.`),
			);

			const deviceOptional = await this._deviceRepository.find(input.deviceDocumentId);

			const device = deviceOptional.orElseThrow(
				() => new Error(`Device with documentId ${input.deviceDocumentId} not found.`),
			);

			room.removeDevice(device.id);

			await this._roomRepository.manageDevices(
				room.id,
				[input.deviceDocumentId],
				DeviceOperation.REMOVE,
			);

			for (const data of device.deviceData) {
				try {
					await this._deviceDataRepository.deleteEntity(data);
				} catch (_error) {
					throw new Error(`Failed to remove device data`);
				}
			}

			device.deviceData = [];
		} catch (_error) {
			throw new Error(`Failed to remove device from room`);
		}
	}
}
