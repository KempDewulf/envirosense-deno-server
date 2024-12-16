import {
    DeleteRoomInput,
    RoomRepository,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteRoom implements UseCase<DeleteRoomInput> {
    private readonly _roomRepository: RoomRepository;

    constructor(roomRepository: RoomRepository) {
        this._roomRepository = roomRepository;
    }

    public async execute(input: DeleteRoomInput): Promise<void> {
        const roomType = (
            await this._roomRepository.find(input.roomDocumentId)
        ).orElseThrow(
            () => new Error(`Room with ID ${input.roomDocumentId} not found.`)
        );

        await this._roomRepository.deleteEntity(roomType);
    }
}
