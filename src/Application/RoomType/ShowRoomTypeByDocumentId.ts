import {
    OutputPort,
    UseCase,
    ShowRoomTypeByDocumentIdInput,
    ShowRoomTypeByDocumentIdOutput,
    RoomTypeQueryByDocumentIdDto,
    RoomTypeQueryRepository,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowRoomTypeByDocumentId
    implements UseCase<ShowRoomTypeByDocumentIdInput>
{
    private readonly _outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput[]>;
    private readonly _roomTypeQueryRepository: RoomTypeQueryRepository;

    constructor(
        outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput[]>,
        roomTypeQueryRepository: RoomTypeQueryRepository
    ) {
        this._outputPort = outputPort;
        this._roomTypeQueryRepository = roomTypeQueryRepository;
    }

    public async execute(input: ShowRoomTypeByDocumentIdInput): Promise<void> {
        const roomTypeDto = await this._roomTypeQueryRepository.find(
            input.documentId
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
