import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
    OutputPort,
    ShowBuildingsOutput,
} from "EnviroSense/Application/Contracts/mod.ts";

export type ShowBuildingsPresentedData = {
    id: string;
    name: string;
    address: string;
};

export class ShowBuildingsPresenter implements OutputPort<ShowBuildingsOutput[]> {
    private readonly _device: RequestResponseDevice<ShowBuildingsPresentedData[]>;

    constructor(device: RequestResponseDevice<ShowBuildingsPresentedData[]>) {
        this._device = device;
    }

    present(data: ShowBuildingsOutput[]): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(
        data: ShowBuildingsOutput[]
    ): ShowBuildingsPresentedData[] {
        return data.map((building: ShowBuildingsOutput) => ({
            id: building.id,
            name: building.name,
            address: building.address,
        }));
    }
}
