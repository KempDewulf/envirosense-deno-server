import {
    OutputPort,
    UseCase,
    ShowRoomTypeByDocumentIdInput,
    ShowRoomTypeByDocumentIdOutput,
    RoomTypeQueryDto,
    RoomTypeRepository,
} from "EnviroSense/Application/Contracts/mod.ts";

export class ShowRoomTypeByDocumentId
    implements UseCase<ShowRoomTypeByDocumentIdInput>
{
    private readonly _outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput>;
    private readonly _roomTypeRepository: RoomTypeRepository;

    constructor(
        outputPort: OutputPort<ShowRoomTypeByDocumentIdOutput>,
        roomTypeRepository: RoomTypeRepository
    ) {
        this._outputPort = outputPort;
        this._roomTypeRepository = roomTypeRepository;
    }

    public async execute(input: ShowRoomTypeByDocumentIdInput): Promise<void> {
        const roomTypeDto = await this._roomTypeRepository.find(
            input.roomTypeDocumentId
        );
        const roomType = this.mapDtoToOutput(roomTypeDto);
        this._outputPort.present(roomType);
    }

    private mapDtoToOutput(
        dto: RoomTypeQueryDto
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
