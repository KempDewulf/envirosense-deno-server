import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowRoomTypeByDocumentIdOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { Room } from "EnviroSense/Domain/mod.ts";

export type ShowRoomTypeByDocumentIdPresentedData = {
	id: string;
	documentId: string;
	name: string;
	icon: string;
	rooms: Room[];
};

export class ShowRoomTypeByDocumentIdPresenter implements OutputPort<ShowRoomTypeByDocumentIdOutput> {
	private readonly _device: RequestResponseDevice<
		ShowRoomTypeByDocumentIdPresentedData
	>;

	constructor(
		device: RequestResponseDevice<ShowRoomTypeByDocumentIdPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowRoomTypeByDocumentIdOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowRoomTypeByDocumentIdOutput,
	): ShowRoomTypeByDocumentIdPresentedData {
		return {
			id: data.id,
			documentId: data.documentId,
			name: data.name,
			icon: data.icon,
			rooms: data.rooms,
		};
	}
}
