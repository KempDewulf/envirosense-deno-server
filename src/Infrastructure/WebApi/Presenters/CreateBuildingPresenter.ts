import { RequestResponseDevice } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { CreateBuildingOutput, OutputPort } from 'EnviroSense/Application/Contracts/mod.ts';

export interface CreateBuildingPresentedData {
    url: string;
}

export class CreateBuildingPresenter implements OutputPort<CreateBuildingOutput> {
    private readonly _device: RequestResponseDevice<CreateBuildingPresentedData>;

    constructor(device: RequestResponseDevice<CreateBuildingPresentedData>) {
        this._device = device;
    }

    present(data: CreateBuildingOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(data: CreateBuildingOutput): CreateBuildingPresentedData {
        return {
            url: `/buildings/${data.id}`,
        };
    }
}
