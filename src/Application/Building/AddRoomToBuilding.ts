import { AddRoomToBuildingInput, BuildingRepository, RoomRepository, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { RoomOperation } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { BuildingNotFoundError, RoomNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

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
		const building = (await this._buildingRepository.find(input.buildingDocumentId)).orElseThrow(() =>
			new BuildingNotFoundError(input.buildingDocumentId)
		);

		const roomDocumentIdsToConnect: string[] = [];

		for (const roomDocumentId of input.rooms) {
			const room = (await this._roomRepository.find(roomDocumentId)).orElseThrow(() => new RoomNotFoundError(roomDocumentId));

			building.addRoom(room);

			roomDocumentIdsToConnect.push(room.documentId);
		}

		await this._buildingRepository.manageRooms(
			building.documentId,
			roomDocumentIdsToConnect,
			RoomOperation.ADD,
		);
	}
}
