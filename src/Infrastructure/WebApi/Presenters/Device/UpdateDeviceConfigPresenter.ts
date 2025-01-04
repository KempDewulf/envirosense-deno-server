import { OutputPort, UpdateDeviceConfigOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface UpdateDeviceConfigPresentedData {
	documentId: string;
	configType: string;
	value: string | number;
}

export class UpdateDeviceConfigPresenter implements OutputPort<UpdateDeviceConfigOutput> {
	private readonly _device: RequestResponseDevice<UpdateDeviceConfigPresentedData>;

	constructor(device: RequestResponseDevice<UpdateDeviceConfigPresentedData>) {
		this._device = device;
	}

	present(data: UpdateDeviceConfigOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: UpdateDeviceConfigOutput,
	): UpdateDeviceConfigPresentedData {
		return {
			documentId: data.documentId,
			configType: data.configType,
			value: data.value,
		};
	}
}
