import {
    OutputPort,
    UseCase,
    ShowRoomTypeByDocumentIdInput,
    ShowRoomTypeByDocumentIdOutput,
    RoomTypeQueryByDocumentIdDto,
    RoomTypeQueryRepository,
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

        //TODO: ask dimitri about this since there is no example online and i can't figure it out myself or ai
        /*
        Argument of type 'Optional<RoomType>' is not assignable to parameter of type 'RoomTypeQueryByDocumentIdDto'.
  Type 'Optional<RoomType>' is missing the following properties from type 'RoomTypeQueryByDocumentIdDto': id, documentId, name, icon, rooms
        */
        // I know why it doesn't work but i don't know how I can fix it since we can reuse the find from other repo
        //because it has Optional<RoomType> as return type for other features and now we need to only send the DTO?
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
