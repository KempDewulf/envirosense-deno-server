import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowDevicesOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { Room } from "EnviroSense/Domain/mod.ts";

export type ShowDevicesPresentedData = {
	documentId: string;
	identifier: string;
	room: Room;
};

export class ShowDevicesPresenter implements OutputPort<ShowDevicesOutput[]> {
	private readonly _device: RequestResponseDevice<ShowDevicesPresentedData[]>;

	constructor(device: RequestResponseDevice<ShowDevicesPresentedData[]>) {
		this._device = device;
	}

	present(data: ShowDevicesOutput[]): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowDevicesOutput[],
	): ShowDevicesPresentedData[] {
		return data.map((device: ShowDevicesOutput) => ({
			documentId: device.documentId,
			identifier: device.identifier,
			room: device.room,
		}));
	}
}
