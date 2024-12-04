import {
    OutputPort,
    ShowRoomTypesInput,
    ShowRoomTypesOutput,
    RoomTypeQueryAllDto,
    RoomTypeQueryRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowRoomTypes implements UseCase<ShowRoomTypesInput> {
    private readonly _outputPort: OutputPort<ShowRoomTypesOutput[]>;
    private readonly _roomTypeQueryRepository: RoomTypeQueryRepository;

    constructor(
        outputPort: OutputPort<ShowRoomTypesOutput[]>,
        roomTypeQueryRepository: RoomTypeQueryRepository
    ) {
        this._outputPort = outputPort;
        this._roomTypeQueryRepository = roomTypeQueryRepository;
    }

    public async execute(input: ShowRoomTypesInput): Promise<void> {
        const roomTypesDto = await this._roomTypeQueryRepository.all(
            input.name
        );
        const roomTypes = this.mapDtoToOutput(roomTypesDto);
        this._outputPort.present(roomTypes);
    }

    private mapDtoToOutput(dto: RoomTypeQueryAllDto[]): ShowRoomTypesOutput[] {
        return dto.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            icon: item.icon,
            rooms: item.rooms,
        }));
    }
}
