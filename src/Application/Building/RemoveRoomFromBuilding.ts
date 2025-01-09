import { BuildingRepository, RemoveRoomFromBuildingInput, RoomRepository, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { RoomOperation } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { BuildingNotFoundError, RoomNotFoundError } from "EnviroSense/Infrastructure/Shared/mod.ts";

export class RemoveRoomFromBuilding implements UseCase<RemoveRoomFromBuildingInput> {
	private readonly _buildingRepository: BuildingRepository;
	private readonly _roomRepository: RoomRepository;

	constructor(
		buildingRepository: BuildingRepository,
		roomRepository: RoomRepository,
	) {
		this._buildingRepository = buildingRepository;
		this._roomRepository = roomRepository;
	}

	async execute(input: RemoveRoomFromBuildingInput): Promise<void> {
		const building = (await this._buildingRepository.find(input.buildingDocumentId)).orElseThrow(() =>
			new BuildingNotFoundError(input.buildingDocumentId)
		);

		const room = (await this._roomRepository.find(input.roomDocumentId)).orElseThrow(() => new RoomNotFoundError(input.roomDocumentId));

		building.removeRoom(room.documentId);

		await this._buildingRepository.manageRooms(
			building.documentId,
			[input.roomDocumentId],
			RoomOperation.REMOVE,
		);
	}
}
