import { RequestResponseDevice } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { OutputPort, ShowDevicesOutput } from 'EnviroSense/Application/Contracts/mod.ts';
import { DeviceData, Room } from 'EnviroSense/Domain/mod.ts';

export type ShowDevicesPresentedData = {
    id: string;
    documentId: string;
    identifier: string;
    room: Room;
    device_data: DeviceData[];
};

export class ShowDevicesPresenter implements OutputPort<ShowDevicesOutput[]> {
    private readonly _device: RequestResponseDevice<ShowDevicesPresentedData[]>;

    constructor(device: RequestResponseDevice<ShowDevicesPresentedData[]>) {
        this._device = device;
    }

    present(data: ShowDevicesOutput[]): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(
        data: ShowDevicesOutput[],
    ): ShowDevicesPresentedData[] {
        return data.map((device: ShowDevicesOutput) => ({
            id: device.id,
            documentId: device.documentId,
            identifier: device.identifier,
            room: device.room,
            device_data: device.device_data,
        }));
    }
}
