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
    private readonly _outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput>;
    private readonly _roomTypeQueryRepository: RoomTypeQueryRepository;

    constructor(
        outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput>,
        roomTypeRepository: RoomTypeQueryRepository
    ) {
        this._outputPort = outputPort;
        this._roomTypeQueryRepository = roomTypeRepository;
    }

    public async execute(input: ShowRoomTypeByDocumentIdInput): Promise<void> {
        const roomTypeDto = await this._roomTypeQueryRepository.find(
            input.roomTypeDocumentId
        );

        const roomType = this.mapDtoToOutput(roomTypeDto);
        this._outputPort.present(roomType);
    }

    private mapDtoToOutput(
        dto: RoomTypeQueryByDocumentIdDto
    ): ShowRoomTypeByDocumentIdOutput {
        return {
            id: dto.id,
            documentId: dto.documentId,
            name: dto.name,
            icon: dto.icon,
            rooms: dto.rooms,
        };
    }
}
