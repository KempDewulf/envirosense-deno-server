import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowRoomTypesOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { Room } from "EnviroSense/Domain/mod.ts";

export type ShowRoomTypesPresentedData = {
	documentId: string;
	documentId: string;
	name: string;
	icon: string;
	rooms: Room[];
};

export class ShowRoomTypesPresenter implements OutputPort<ShowRoomTypesOutput[]> {
	private readonly _device: RequestResponseDevice<
		ShowRoomTypesPresentedData[]
	>;

	constructor(device: RequestResponseDevice<ShowRoomTypesPresentedData[]>) {
		this._device = device;
	}

	present(data: ShowRoomTypesOutput[]): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowRoomTypesOutput[],
	): ShowRoomTypesPresentedData[] {
		return data.map((roomType: ShowRoomTypesOutput) => ({
			documentId: roomType.documentId,
			documentId: roomType.documentId,
			name: roomType.name,
			icon: roomType.icon,
			rooms: roomType.rooms,
		}));
	}
}
