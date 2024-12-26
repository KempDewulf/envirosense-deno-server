import { RequestResponseDevice } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { OutputPort, ShowDeviceDataByDocumentIdOutput } from "EnviroSense/Application/Contracts/mod.ts";
import { AirData, Device } from "EnviroSense/Domain/mod.ts";

export type ShowDeviceDataByDocumentIdPresentedData = {
	documentId: string;
	documentId: string;
	device: Device;
	timestamp: Date;
	airData: AirData;
};

export class ShowDeviceDataByDocumentIdPresenter implements OutputPort<ShowDeviceDataByDocumentIdOutput> {
	private readonly _device: RequestResponseDevice<ShowDeviceDataByDocumentIdPresentedData>;

	constructor(
		device: RequestResponseDevice<ShowDeviceDataByDocumentIdPresentedData>,
	) {
		this._device = device;
	}

	present(data: ShowDeviceDataByDocumentIdOutput): void {
		const presentedData = this.mapToPresentedData(data);
		this._device.update(presentedData);
	}

	protected mapToPresentedData(
		data: ShowDeviceDataByDocumentIdOutput,
	): ShowDeviceDataByDocumentIdPresentedData {
		return {
			documentId: data.documentId,
			documentId: data.documentId,
			device: data.device,
			timestamp: data.timestamp,
			airData: data.airData,
		};
	}
}
