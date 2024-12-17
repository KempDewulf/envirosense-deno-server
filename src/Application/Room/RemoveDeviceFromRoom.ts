import {
    DeviceRepository,
    RemoveDeviceFromRoomInput,
    RoomRepository,
    UseCase,
} from 'EnviroSense/Application/Contracts/mod.ts';
import { DeviceOperation } from 'EnviroSense/Infrastructure/Persistence/Repositories/Strapi/Room/RoomStrapiRepository.ts';

export class RemoveDeviceFromRoom implements UseCase<RemoveDeviceFromRoomInput> {
    private readonly _roomRepository: RoomRepository;
    private readonly _deviceRepository: DeviceRepository;

    constructor(
        roomRepository: RoomRepository,
        deviceRepository: DeviceRepository,
    ) {
        this._roomRepository = roomRepository;
        this._deviceRepository = deviceRepository;
    }

    async execute(input: RemoveDeviceFromRoomInput): Promise<void> {
        const roomOptional = await this._roomRepository.find(
            input.roomDocumentId,
        );

        const room = roomOptional.orElseThrow(
            () =>
                new Error(
                    `Room with ID ${input.roomDocumentId} not found.`,
                ),
        );

        const deviceOptional = await this._deviceRepository.find(
            input.deviceDocumentId,
        );

        const device = deviceOptional.orElseThrow(
            () =>
                new Error(
                    `Device with documentId ${input.deviceDocumentId} not found.`,
                ),
        );

        room.removeDevice(device.id);

        await this._roomRepository.manageDevices(
            room.id,
            [input.deviceDocumentId],
            DeviceOperation.REMOVE,
        );
    }
}
