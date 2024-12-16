import { RequestResponseDevice } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { UpdateRoomOutput, OutputPort } from 'EnviroSense/Application/Contracts/mod.ts';

export interface UpdateRoomPresentedData {
    id: string;
    documentId: string;
    name: string;
}

export class UpdateRoomPresenter implements OutputPort<UpdateRoomOutput> {
    private readonly _device: RequestResponseDevice<UpdateRoomPresentedData>;

    constructor(device: RequestResponseDevice<UpdateRoomPresentedData>) {
        this._device = device;
    }

    present(data: UpdateRoomOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(data: UpdateRoomOutput): UpdateRoomPresentedData {
        return {
            id: data.id,
            documentId: data.documentId,
            name: data.name,
        };
    }
}
