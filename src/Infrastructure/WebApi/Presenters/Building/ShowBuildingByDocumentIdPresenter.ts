import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	OutputPort,
	ShowBuildingByDocumentIdOutput,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Room } from "EnviroSense/Domain/mod.ts";

export type ShowBuildingByDocumentIdPresentedData = {
	id: string;
	documentId: string;
	name: string;
	address: string;
	rooms?: Room[];
};

export class ShowBuildingByDocumentIdPresenter
	implements OutputPort<ShowBuildingByDocumentIdOutput> {
	private readonly _device: RequestResponseDevice<ShowBuildingByDocumentIdPresentedData>;

	constructor(
		device: RequestResponseDevice<ShowBuildingByDocumentIdPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowBuildingByDocumentIdOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowBuildingByDocumentIdOutput,
	): ShowBuildingByDocumentIdPresentedData {
		return {
			id: data.id,
			documentId: data.documentId,
			name: data.name,
			address: data.address,
			rooms: data.rooms,
		};
	}
}
