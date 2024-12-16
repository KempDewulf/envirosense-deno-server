import { RequestResponseDevice } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { CreateDeviceOutput, OutputPort } from 'EnviroSense/Application/Contracts/mod.ts';

export interface CreateDevicePresentedData {
    url: string;
}

export class CreateDevicePresenter implements OutputPort<CreateDeviceOutput> {
    private readonly _device: RequestResponseDevice<CreateDevicePresentedData>;

    constructor(device: RequestResponseDevice<CreateDevicePresentedData>) {
        this._device = device;
    }

    present(data: CreateDeviceOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(data: CreateDeviceOutput): CreateDevicePresentedData {
        return {
            url: `/device-data/${data.id}`,
        };
    }
}
