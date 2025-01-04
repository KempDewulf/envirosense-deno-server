import { OutputPort, UpdateDeviceUiModeOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface UpdateDeviceUiModePresentedData {
	documentId: string;
	mode: string;
}

export class UpdateDeviceUiModePresenter implements OutputPort<UpdateDeviceUiModeOutput> {
	private readonly _device: RequestResponseDevice<UpdateDeviceUiModePresentedData>;

	constructor(device: RequestResponseDevice<UpdateDeviceUiModePresentedData>) {
		this._device = device;
	}

	present(data: UpdateDeviceUiModeOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: UpdateDeviceUiModeOutput,
	): UpdateDeviceUiModePresentedData {
		return {
			documentId: data.documentId,
			mode: data.mode,
		};
	}
}
