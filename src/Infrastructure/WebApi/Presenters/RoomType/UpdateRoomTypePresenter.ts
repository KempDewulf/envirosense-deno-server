import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, UpdateRoomTypeOutput } from "EnviroSense/Application/Contracts/mod.ts";

export interface UpdateRoomTypePresentedData {
	id: string;
	documentId: string;
	name: string;
	icon: string;
}

export class UpdateRoomTypePresenter implements OutputPort<UpdateRoomTypeOutput> {
	private readonly _device: RequestResponseDevice<
		UpdateRoomTypePresentedData
	>;

	constructor(device: RequestResponseDevice<UpdateRoomTypePresentedData>) {
		this._device = device;
	}

	present(data: UpdateRoomTypeOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: UpdateRoomTypeOutput,
	): UpdateRoomTypePresentedData {
		return {
			id: data.id,
			documentId: data.documentId,
			name: data.name,
			icon: data.icon,
		};
	}
}
