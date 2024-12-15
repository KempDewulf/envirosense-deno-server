import {
    BuildingRepository,
    UseCase,
    AddRoomToBuildingInput,
    RoomTypeRepository,
} from "EnviroSense/Application/Contracts/mod.ts";
import { DomainException, Room } from "EnviroSense/Domain/mod.ts";

export class AddRoomToBuilding implements UseCase<AddRoomToBuildingInput> {
    private readonly _buildingRepository: BuildingRepository;
    private readonly _roomTypeRepository: RoomTypeRepository;

    constructor(buildingRepository: BuildingRepository, roomTypeRepository: RoomTypeRepository) {
        this._buildingRepository = buildingRepository;
        this._roomTypeRepository = roomTypeRepository;
    }

    async execute(input: AddRoomToBuildingInput): Promise<void> {
        const buildingDocumentId = input.buildingDocumentId;
        const roomTypeDocumentId = input.roomTypeDocumentId;

        const building = (
            await this._buildingRepository.find(buildingDocumentId)
        ).orElseThrow(() => new DomainException("Building not found"));

        const roomType = (
            await this._roomTypeRepository.find(roomTypeDocumentId)
        ).orElseThrow(() => new DomainException("Room type not found"));

        const room = Room.create('', input.name, building, roomType);
        building.addRoom(room);

        this._buildingRepository.update(building);
    }
}
