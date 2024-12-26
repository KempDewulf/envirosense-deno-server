import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, UpdateBuildingOutput } from "EnviroSense/Application/Contracts/mod.ts";

export interface UpdateBuildingPresentedData {
	documentId: string;
	name: string;
	address: string;
}

export class UpdateBuildingPresenter implements OutputPort<UpdateBuildingOutput> {
	private readonly _device: RequestResponseDevice<UpdateBuildingPresentedData>;

	constructor(device: RequestResponseDevice<UpdateBuildingPresentedData>) {
		this._device = device;
	}

	present(data: UpdateBuildingOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: UpdateBuildingOutput,
	): UpdateBuildingPresentedData {
		return {
			documentId: data.documentId,
			name: data.name,
			address: data.address,
		};
	}
}
