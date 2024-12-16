import { Room } from "EnviroSense/Domain/mod.ts";
import {
    BuildingRepository,
    CreateRoomInput,
    CreateRoomOutput,
    OutputPort,
    RoomRepository,
    RoomTypeRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class CreateRoom implements UseCase<CreateRoomInput> {
    private readonly _outputPort: OutputPort<CreateRoomOutput>;
    private readonly _roomRepository: RoomRepository;
    private readonly _buildingRepository: BuildingRepository;
    private readonly _roomTypeRepository: RoomTypeRepository;

    constructor(
        outputPort: OutputPort<CreateRoomOutput>,
        roomRepository: RoomRepository,
        buildingRepository: BuildingRepository,
        roomTypeRepository: RoomTypeRepository
    ) {
        this._outputPort = outputPort;
        this._roomRepository = roomRepository;
        this._buildingRepository = buildingRepository;
        this._roomTypeRepository = roomTypeRepository;
    }

    public async execute(input: CreateRoomInput): Promise<void> {
        const buildingOptional = await this._buildingRepository.find(
            input.buildingId
        );
        const building = buildingOptional.orElseThrow(
            () => new Error(`Building with ID ${input.buildingId} not found.`)
        );

        const roomTypeOptional = await this._roomTypeRepository.find(
            input.roomTypeId
        );
        const roomType = roomTypeOptional.orElseThrow(
            () => new Error(`Room Type with ID ${input.roomTypeId} not found.`)
        );

        const room = Room.create("", input.name, building, roomType);

        await this._roomRepository.save(room);
        this._outputPort.present({ id: room.id.toString() });
    }
}
