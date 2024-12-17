import {
	AddDeviceToRoomInput,
	DeviceRepository,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceOperation } from "EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Room/RoomStrapiRepository.ts";

export class AddDeviceToRoom implements UseCase<AddDeviceToRoomInput> {
	private readonly _roomRepository: RoomRepository;
	private readonly _deviceRepository: DeviceRepository;

	constructor(
		roomRepository: RoomRepository,
		deviceRepository: DeviceRepository,
	) {
		this._roomRepository = roomRepository;
		this._deviceRepository = deviceRepository;
	}

	async execute(input: AddDeviceToRoomInput): Promise<void> {
		const roomOptional = await this._roomRepository.find(
			input.roomDocumentId,
		);

		const room = roomOptional.orElseThrow(
			() =>
				new Error(
					`Room with ID ${input.roomDocumentId} not found.`,
				),
		);

		const deviceDocumentIdsToConnect: string[] = [];

		for (const deviceDocumentId of input.devices) {
			const deviceOptional = await this._deviceRepository.find(
				deviceDocumentId,
			);

			const device = deviceOptional.orElseThrow(
				() =>
					new Error(
						`Device with documentId ${deviceDocumentId} not found.`,
					),
			);

			room.addDevice(device);

			deviceDocumentIdsToConnect.push(device.id);
		}

		await this._roomRepository.manageDevices(
			room.id,
			deviceDocumentIdsToConnect,
			DeviceOperation.ADD,
		);
	}
}
