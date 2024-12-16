import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
    OutputPort,
    ShowDeviceDataOutput,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Device } from "EnviroSense/Domain/mod.ts";

export type ShowDeviceDataPresentedData = {
    id: string;
    documentId: string;
    device: Device;
    timestamp: number;
    temperature: number;
    humidity: number;
    gas_ppm: number;
};

export class ShowDeviceDataPresenter
    implements OutputPort<ShowDeviceDataOutput[]>
{
    private readonly _device: RequestResponseDevice<
        ShowDeviceDataPresentedData[]
    >;

    constructor(device: RequestResponseDevice<ShowDeviceDataPresentedData[]>) {
        this._device = device;
    }

    present(data: ShowDeviceDataOutput[]): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(
        data: ShowDeviceDataOutput[]
    ): ShowDeviceDataPresentedData[] {
        return data.map((deviceData: ShowDeviceDataOutput) => ({
            id: deviceData.id,
            documentId: deviceData.documentId,
            device: deviceData.device,
            timestamp: deviceData.timestamp,
            temperature: deviceData.temperature,
            humidity: deviceData.humidity,
            gas_ppm: deviceData.gas_ppm,
        }));
    }
}
