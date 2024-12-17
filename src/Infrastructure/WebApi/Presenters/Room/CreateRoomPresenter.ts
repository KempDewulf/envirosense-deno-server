import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	CreateRoomOutput,
	OutputPort,
} from "EnviroSense/Application/Contracts/mod.ts";

export interface CreateRoomPresentedData {
	url: string;
}

export class CreateRoomPresenter implements OutputPort<CreateRoomOutput> {
	private readonly _device: RequestResponseDevice<CreateRoomPresentedData>;

	constructor(device: RequestResponseDevice<CreateRoomPresentedData>) {
		this._device = device;
	}

	present(data: CreateRoomOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: CreateRoomOutput,
	): CreateRoomPresentedData {
		return {
			url: `/rooms/${data.id}`,
		};
	}
}
