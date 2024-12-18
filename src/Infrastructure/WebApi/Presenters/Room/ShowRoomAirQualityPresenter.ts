import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	OutputPort,
	ShowRoomAirQualityOutput,
} from "EnviroSense/Application/Contracts/mod.ts";
import { AirData } from "EnviroSense/Domain/mod.ts";

export type ShowRoomAirQualityPresentedData = {
	id: string;
    enviroScore: number;
    airQuality: AirData;
};

export class ShowRoomAirQualityPresenter
	implements OutputPort<ShowRoomAirQualityOutput> {
	private readonly _device: RequestResponseDevice<
		ShowRoomAirQualityPresentedData
	>;

	constructor(
		device: RequestResponseDevice<ShowRoomAirQualityPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowRoomAirQualityOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowRoomAirQualityOutput,
	): ShowRoomAirQualityPresentedData {
		return {
			id: data.id,
            enviroScore: data.enviroScore,
            airQuality: data.airQuality,
		};
	}
}
