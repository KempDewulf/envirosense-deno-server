import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowRoomAirQualityOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { AirData } from "EnviroSense/Domain/mod.ts";

export type ShowRoomAirQualityPresentedData = {
	documentId: string;
	enviroScore: number | null;
	airQuality: AirData | null;
};

export class ShowRoomAirQualityPresenter implements OutputPort<ShowRoomAirQualityOutput> {
	private readonly _device: RequestResponseDevice<ShowRoomAirQualityPresentedData>;

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
			documentId: data.documentId,
			enviroScore: data.enviroScore,
			airQuality: data.airQuality,
		};
	}
}
