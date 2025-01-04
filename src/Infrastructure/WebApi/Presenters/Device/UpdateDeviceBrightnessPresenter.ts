import { OutputPort, UpdateDeviceBrightnessOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface UpdateDeviceBrightnessPresentedData {
	documentId: string;
	value: string;
}

export class UpdateDeviceBrightnessPresenter implements OutputPort<UpdateDeviceBrightnessOutput> {
	private readonly _device: RequestResponseDevice<UpdateDeviceBrightnessPresentedData>;

	constructor(device: RequestResponseDevice<UpdateDeviceBrightnessPresentedData>) {
		this._device = device;
	}

	present(data: UpdateDeviceBrightnessOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: UpdateDeviceBrightnessOutput,
	): UpdateDeviceBrightnessPresentedData {
		return {
			documentId: data.documentId,
			value: data.value,
		};
	}
}
