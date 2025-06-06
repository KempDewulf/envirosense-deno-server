import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, UpdateDeviceOutput } from "EnviroSense/Application/Contracts/mod.ts";

export interface UpdateDevicePresentedData {
	documentId: string;
	identifier: string;
}

export class UpdateDevicePresenter implements OutputPort<UpdateDeviceOutput> {
	private readonly _device: RequestResponseDevice<UpdateDevicePresentedData>;

	constructor(device: RequestResponseDevice<UpdateDevicePresentedData>) {
		this._device = device;
	}

	present(data: UpdateDeviceOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: UpdateDeviceOutput,
	): UpdateDevicePresentedData {
		return {
			documentId: data.documentId,
			identifier: data.identifier,
		};
	}
}
