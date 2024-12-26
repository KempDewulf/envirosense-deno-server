import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowDeviceByDocumentIdOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceData, Room } from "EnviroSense/Domain/mod.ts";
import { sortDeviceDataDesc } from "EnviroSense/Domain/mod.ts";

export type ShowDeviceByDocumentIdPresentedData = {
	documentId: string;
	identifier: string;
	room: Room;
	device_data: DeviceData[];
};

export class ShowDeviceByDocumentIdPresenter implements OutputPort<ShowDeviceByDocumentIdOutput> {
	private readonly _device: RequestResponseDevice<ShowDeviceByDocumentIdPresentedData>;

	constructor(
		device: RequestResponseDevice<ShowDeviceByDocumentIdPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowDeviceByDocumentIdOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowDeviceByDocumentIdOutput,
	): ShowDeviceByDocumentIdPresentedData {
		return {
			documentId: data.documentId,
			identifier: data.identifier,
			room: data.room,
			device_data: sortDeviceDataDesc(data.device_data),
		};
	}
}
