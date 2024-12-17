import {
	AddRoomToBuildingInput,
	BuildingRepository,
	RoomRepository,
	UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { RoomOperation } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export class AddRoomToBuilding implements UseCase<AddRoomToBuildingInput> {
	private readonly _buildingRepository: BuildingRepository;
	private readonly _roomRepository: RoomRepository;

	constructor(
		buildingRepository: BuildingRepository,
		roomRepository: RoomRepository,
	) {
		this._buildingRepository = buildingRepository;
		this._roomRepository = roomRepository;
	}

	async execute(input: AddRoomToBuildingInput): Promise<void> {
		const buildingOptional = await this._buildingRepository.find(
			input.buildingDocumentId,
		);
		const building = buildingOptional.orElseThrow(
			() =>
				new Error(
					`Building with ID ${input.buildingDocumentId} not found.`,
				),
		);

		const roomDocumentIdsToConnect: string[] = [];

		for (const roomDocumentId of input.rooms) {
			const roomOptional = await this._roomRepository.find(
				roomDocumentId,
			);

			const room = roomOptional.orElseThrow(
				() =>
					new Error(
						`Room with documentId ${roomDocumentId} not found.`,
					),
			);

			building.addRoom(room);

			roomDocumentIdsToConnect.push(room.id);
		}

		await this._buildingRepository.manageRooms(
			building.id,
			roomDocumentIdsToConnect,
			RoomOperation.ADD,
		);
	}
}
