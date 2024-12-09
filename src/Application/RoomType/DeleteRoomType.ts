import {
    DeleteRoomTypeInput,
    OutputPort,
    RoomTypeRepository,
    UseCase,
} from 'EnviroSense/Application/Contracts/mod.ts';

export class DeleteRoomType implements UseCase<DeleteRoomTypeInput> {
    private readonly _outputPort: OutputPort<void>;
    private readonly _roomTypeRepository: RoomTypeRepository;

    constructor(
        outputPort: OutputPort<void>,
        roomTypeRepository: RoomTypeRepository,
    ) {
        this._outputPort = outputPort;
        this._roomTypeRepository = roomTypeRepository;
    }

    public async execute(input: DeleteRoomTypeInput): Promise<void> {
        const roomType = (await this._roomTypeRepository.find(input.roomTypeDocumentId))
            .orElseThrow(() => new Error(`RoomType with ID ${input.roomTypeDocumentId} not found.`));

        await this._roomTypeRepository.deleteEntity(roomType);

        this._outputPort.present();
    }
}

