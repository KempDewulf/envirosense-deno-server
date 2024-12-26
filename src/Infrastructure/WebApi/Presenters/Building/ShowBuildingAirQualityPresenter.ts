import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
    OutputPort,
    RoomAirQualityOutput,
    ShowBuildingAirQualityOutput,
} from "EnviroSense/Application/Contracts/mod.ts";

export type ShowBuildingAirQualityPresentedData = {
    documentId: string;
    enviroScore: number | null;
    rooms: RoomAirQualityOutput[];
};

export class ShowBuildingAirQualityPresenter
    implements OutputPort<ShowBuildingAirQualityOutput>
{
    private readonly _device: RequestResponseDevice<ShowBuildingAirQualityPresentedData>;

    constructor(
        device: RequestResponseDevice<ShowBuildingAirQualityPresentedData>
    ) {
        this._device = device;
    }

    present(data: ShowBuildingAirQualityOutput): void {
        const presentedData = this.mapToPresentedData(data);
        this._device.update(presentedData);
    }

    protected mapToPresentedData(
        data: ShowBuildingAirQualityOutput
    ): ShowBuildingAirQualityPresentedData {
        return {
            documentId: data.documentId,
            enviroScore: data.enviroScore,
            rooms: data.rooms,
        };
    }
}
