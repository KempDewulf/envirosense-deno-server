import { RequestResponseDevice } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { UpdateRoomTypeOutput, OutputPort } from 'EnviroSense/Application/Contracts/mod.ts';
import { Room } from 'EnviroSense/Domain/mod.ts';

export interface UpdateRoomTypePresentedData {
    id: string;
    documentId: string;
    name: string;
    icon: string;
    rooms: Room[];
}

export class UpdateRoomTypePresenter implements OutputPort<UpdateRoomTypeOutput> {
    private readonly _device: RequestResponseDevice<UpdateRoomTypePresentedData>;

    constructor(device: RequestResponseDevice<UpdateRoomTypePresentedData>) {
        this._device = device;
    }

    present(data: UpdateRoomTypeOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(data: UpdateRoomTypeOutput): UpdateRoomTypePresentedData {
        return {
            id: data.id,
            documentId: data.documentId,
            name: data.name,
            icon: data.icon,
            rooms: data.rooms
        };
    }
}
