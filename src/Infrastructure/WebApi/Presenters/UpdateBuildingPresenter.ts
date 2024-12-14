import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
    UpdateBuildingOutput,
    OutputPort,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Room } from "EnviroSense/Domain/mod.ts";

export interface UpdateBuildingPresentedData {
    id: string;
    documentId: string;
    name: string;
    address: string;
    rooms?: Room[];
}

export class UpdateBuildingPresenter
    implements OutputPort<UpdateBuildingOutput>
{
    private readonly _device: RequestResponseDevice<UpdateBuildingPresentedData>;

    constructor(device: RequestResponseDevice<UpdateBuildingPresentedData>) {
        this._device = device;
    }

    present(data: UpdateBuildingOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(
        data: UpdateBuildingOutput
    ): UpdateBuildingPresentedData {
        return {
            id: data.id,
            documentId: data.id,
            name: data.name,
            address: data.address,
            rooms: data.rooms,
        };
    }
}
