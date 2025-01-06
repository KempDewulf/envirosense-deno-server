import {
	AddDeviceToRoomInput,
	DeviceDataQueryDto,
	DeviceDataRepository,
	DeviceRepository,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceOperation } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Room/RoomStrapiRepository.ts";
import { DeviceData } from "EnviroSense/Domain/mod.ts";
import { DeviceDataStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export class AddDeviceToRoom implements UseCase<AddDeviceToRoomInput> {
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

	async execute(input: AddDeviceToRoomInput): Promise<void> {
		try {
			const room = (await this._roomRepository.find(input.roomDocumentId))
				.orElseThrow(() => new Error(`Room with ID ${input.roomDocumentId} not found.`));

			const deviceDocumentIdsToConnect: string[] = [];

			for (const deviceDocumentId of input.devices) {
				const deviceOptional = await this._deviceRepository.find(deviceDocumentId);

				const device = deviceOptional.orElseThrow(
					() => new Error(`Device with documentId ${deviceDocumentId} not found.`),
				);

				room.addDevice(device);
				deviceDocumentIdsToConnect.push(device.documentId);

				const deviceData = await new DeviceDataStrapiQueryRepository().all(device.identifier);

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
			}

			await this._roomRepository.manageDevices(
				room.documentId,
				deviceDocumentIdsToConnect,
				DeviceOperation.ADD,
			);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while adding devices to room";
			throw new Error(`Failed to add devices to room: ${errorMessage}`);
		}
	}
}
