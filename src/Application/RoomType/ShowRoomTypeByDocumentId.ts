import {
    OutputPort,
    UseCase,
    ShowRoomTypeByDocumentIdInput,
    ShowRoomTypeByDocumentIdOutput,
    RoomTypeQueryByDocumentIdDto,
    RoomTypeRepository,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowRoomTypeByDocumentId
    implements UseCase<ShowRoomTypeByDocumentIdInput>
{
    private readonly _outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput[]>;
    private readonly _roomTypeRepository: RoomTypeRepository;

    constructor(
        outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput[]>,
        roomTypeQueryRepository: RoomTypeRepository
    ) {
        this._outputPort = outputPort;
        this._roomTypeRepository = roomTypeQueryRepository;
    }

    public async execute(input: ShowRoomTypeByDocumentIdInput): Promise<void> {
        const roomTypeDto = await this._roomTypeRepository.find(
            input.roomTypeDocumentId
        );
        const roomTypes = this.mapDtoToOutput(roomTypeDto);
        this._outputPort.present(roomTypes);
    }

    private mapDtoToOutput(
        dto: RoomTypeQueryByDocumentIdDto
    ): ShowRoomTypeByDocumentIdOutput[] {
        return dto.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            name: item.name,
            icon: item.icon,
            rooms: item.rooms,
        }));
    }
}
