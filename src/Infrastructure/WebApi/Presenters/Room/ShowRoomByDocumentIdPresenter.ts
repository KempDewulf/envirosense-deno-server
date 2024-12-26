import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowRoomByDocumentIdOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { Building, Device, RoomType } from "EnviroSense/Domain/mod.ts";

export type ShowRoomByDocumentIdPresentedData = {
	documentId: string;
	name: string;
	building: Building | null;
	roomType: RoomType;
	devices?: Device[];
};

export class ShowRoomByDocumentIdPresenter implements OutputPort<ShowRoomByDocumentIdOutput> {
	private readonly _device: RequestResponseDevice<ShowRoomByDocumentIdPresentedData>;

	constructor(
		device: RequestResponseDevice<ShowRoomByDocumentIdPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowRoomByDocumentIdOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowRoomByDocumentIdOutput,
	): ShowRoomByDocumentIdPresentedData {
		return {
			documentId: data.documentId,
			name: data.name,
			building: data.building,
			roomType: data.roomType,
			devices: data.devices,
		};
	}
}
