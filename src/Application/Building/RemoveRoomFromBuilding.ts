import {
    BuildingRepository,
    UseCase,
    RemoveRoomFromBuildingInput,
    RoomRepository,
} from "EnviroSense/Application/Contracts/mod.ts";
import { RoomOperation } from "EnviroSense/Infrastructure/Persistence/mod.ts";

export class RemoveRoomFromBuilding
    implements UseCase<RemoveRoomFromBuildingInput>
{
    private readonly _buildingRepository: BuildingRepository;
    private readonly _roomRepository: RoomRepository;

    constructor(
        buildingRepository: BuildingRepository,
        roomRepository: RoomRepository
    ) {
        this._buildingRepository = buildingRepository;
        this._roomRepository = roomRepository;
    }

    async execute(input: RemoveRoomFromBuildingInput): Promise<void> {
        const buildingOptional = await this._buildingRepository.find(
            input.buildingDocumentId
        );
        const building = buildingOptional.orElseThrow(
            () =>
                new Error(
                    `Building with ID ${input.buildingDocumentId} not found.`
                )
        );

        const roomOptional = await this._roomRepository.find(
            input.roomDocumentId
        );

        const room = roomOptional.orElseThrow(
            () =>
                new Error(
                    `Room with documentId ${input.roomDocumentId} not found.`
                )
        );

        building.removeRoom(room.id);

        await this._buildingRepository.manageRooms(
            building.id,
            [input.roomDocumentId],
            RoomOperation.REMOVE
        );
    }
}
