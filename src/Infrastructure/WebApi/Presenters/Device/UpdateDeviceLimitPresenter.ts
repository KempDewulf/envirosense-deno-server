import {
    UpdateDeviceLimitOutput,
    OutputPort,
} from "EnviroSense/Application/Contracts/mod.ts";
import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface UpdateDeviceLimitPresentedData {
    documentId: string;
    limitType: string;
    value: number;
}

export class UpdateDeviceLimitPresenter
    implements OutputPort<UpdateDeviceLimitOutput>
{
    private readonly _device: RequestResponseDevice<UpdateDeviceLimitPresentedData>;

    constructor(device: RequestResponseDevice<UpdateDeviceLimitPresentedData>) {
        this._device = device;
    }

    present(data: UpdateDeviceLimitOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(
        data: UpdateDeviceLimitOutput
    ): UpdateDeviceLimitPresentedData {
        return {
            documentId: data.documentId,
            limitType: data.limitType,
            value: data.value,
        };
    }
}
