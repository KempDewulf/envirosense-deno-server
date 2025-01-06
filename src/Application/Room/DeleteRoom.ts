import { DeleteRoomInput, DeviceDataRepository, RoomRepository, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceDataStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { DeviceData } from "EnviroSense/Domain/mod.ts";

export class DeleteRoom implements UseCase<DeleteRoomInput> {
	private readonly _roomRepository: RoomRepository;
	private readonly _deviceDataRepository: DeviceDataRepository;

	constructor(
		roomRepository: RoomRepository,
		deviceDataRepository: DeviceDataRepository,
	) {
		this._roomRepository = roomRepository;
		this._deviceDataRepository = deviceDataRepository;
	}

	public async execute(input: DeleteRoomInput): Promise<void> {
		const room = (
			await this._roomRepository.find(input.roomDocumentId)
		).orElseThrow(
			() => new Error(`Room with ID ${input.roomDocumentId} not found.`),
		);

		// Delete device data for each device
		for (const device of room.devices) {
			const deviceData = await new DeviceDataStrapiQueryRepository().all(
				device.identifier,
			);

			const deletePromises = deviceData.map((data) => {
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

		await this._roomRepository.deleteEntity(room);
	}
}
