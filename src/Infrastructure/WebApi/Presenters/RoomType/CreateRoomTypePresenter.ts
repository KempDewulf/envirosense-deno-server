import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
    CreateRoomTypeOutput,
    OutputPort,
} from "EnviroSense/Application/Contracts/mod.ts";

export interface CreateRoomTypePresentedData {
    url: string;
}

export class CreateRoomTypePresenter
    implements OutputPort<CreateRoomTypeOutput>
{
    private readonly _device: RequestResponseDevice<CreateRoomTypePresentedData>;

    constructor(device: RequestResponseDevice<CreateRoomTypePresentedData>) {
        this._device = device;
    }

    present(data: CreateRoomTypeOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(
        data: CreateRoomTypeOutput
    ): CreateRoomTypePresentedData {
        return {
            url: `/room-types/${data.documentId}`,
        };
    }
}
