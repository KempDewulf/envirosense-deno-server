import { OutputPort, ShowRoomLimitsOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface ShowRoomLimitsPresentedData {
	documentId: string;
	limits: Record<string, number | string>;
}

export class ShowRoomLimitsPresenter implements OutputPort<ShowRoomLimitsOutput> {
	private readonly _device: RequestResponseDevice<ShowRoomLimitsPresentedData>;

	constructor(
		device: RequestResponseDevice<ShowRoomLimitsPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowRoomLimitsOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowRoomLimitsOutput,
	): ShowRoomLimitsPresentedData {
		return {
			documentId: data.documentId,
            limits: data.limits,
		};
	}
}
