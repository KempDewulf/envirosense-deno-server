import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort } from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteBuildingPresenter implements OutputPort<void> {
	private readonly _device: RequestResponseDevice<void>;

	constructor(device: RequestResponseDevice<void>) {
		this._device = device;
	}

	present(): void {
		this._device.update();
	}
}
