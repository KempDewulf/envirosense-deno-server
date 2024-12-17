import { RoomType } from 'EnviroSense/Domain/mod.ts';
import {
    CreateRoomTypeInput,
    CreateRoomTypeOutput,
    OutputPort,
    RoomTypeRepository,
    UseCase,
} from 'EnviroSense/Application/Contracts/mod.ts';

export class CreateRoomType implements UseCase<CreateRoomTypeInput> {
    private readonly _outputPort: OutputPort<CreateRoomTypeOutput>;
    private readonly _roomTypeRepository: RoomTypeRepository;

    constructor(
        outputPort: OutputPort<CreateRoomTypeOutput>,
        roomTypeRepository: RoomTypeRepository,
    ) {
        this._outputPort = outputPort;
        this._roomTypeRepository = roomTypeRepository;
    }

    public async execute(input: CreateRoomTypeInput): Promise<void> {
        const roomType = RoomType.create(
            '',
            input.name,
            input.icon,
        );

        await this._roomTypeRepository.save(roomType);
        this._outputPort.present({ id: roomType.id.toString() });
    }
}
