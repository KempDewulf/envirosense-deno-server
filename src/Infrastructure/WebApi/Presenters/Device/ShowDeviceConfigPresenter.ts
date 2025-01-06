import { OutputPort, ShowDeviceConfigOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface ShowDeviceConfigPresentedData {
	documentId: string;
	config: Record<string, number | string>;
}

export class ShowDeviceConfigPresenter implements OutputPort<ShowDeviceConfigOutput> {
	private readonly _device: RequestResponseDevice<ShowDeviceConfigPresentedData>;

	constructor(
		device: RequestResponseDevice<ShowDeviceConfigPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowDeviceConfigOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowDeviceConfigOutput,
	): ShowDeviceConfigPresentedData {
		return {
			documentId: data.documentId,
			config: data.config,
		};
	}
}
