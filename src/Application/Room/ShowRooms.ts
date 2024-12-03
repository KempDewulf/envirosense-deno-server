import {
    OutputPort,
    ShowRoomsInput,
    ShowRoomsOutput,
    RoomQueryAllDto,
    RoomQueryRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowRooms implements UseCase<ShowRoomsInput> {
    private readonly _outputPort: OutputPort<ShowRoomsOutput[]>;
    private readonly _roomQueryRepository: RoomQueryRepository;

    constructor(
        outputPort: OutputPort<ShowRoomsOutput[]>,
        roomQueryRepository: RoomQueryRepository
    ) {
        this._outputPort = outputPort;
        this._roomQueryRepository = roomQueryRepository;
    }

    public async execute(input: ShowRoomsInput): Promise<void> {
        const roomsDto = await this._roomQueryRepository.all(input.name);
        const rooms = this.mapDtoToOutput(roomsDto);
        this._outputPort.present(rooms);
    }

    private mapDtoToOutput(dto: RoomQueryAllDto[]): ShowRoomsOutput[] {
        return dto.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            building: item.building,
            room_type: item['room-type'],
            devices: item.devices,
        }));
    }
}
