import { RouterContext } from "@oak/oak";
import {
	DeleteAllDeviceDataFromDeviceController,
	DeleteAllDeviceDataFromDeviceRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceDataStrapiRepository, DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { DeleteAllDeviceDataFromDevice } from "EnviroSense/Application/mod.ts";
import { DeviceDataRepository, DeviceRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteAllDeviceDataFromDeviceEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const repository: DeviceRepository = new DeviceStrapiRepository();
		const deviceDataRepository: DeviceDataRepository = new DeviceDataStrapiRepository();

		const useCase = new DeleteAllDeviceDataFromDevice(repository, deviceDataRepository);

		const controller = new DeleteAllDeviceDataFromDeviceController(useCase);

		await controller.handle(request);

		context.response.status = 204;
	}

	private buildRequest(context: RouterContext<string>): DeleteAllDeviceDataFromDeviceRequest {
		const deviceDocumentId = context.params.deviceDocumentId || "";
		return { deviceDocumentId } as DeleteAllDeviceDataFromDeviceRequest;
	}

	private validateRequest(request: DeleteAllDeviceDataFromDeviceRequest): void {
		this._errorsBag.clear();

		if (!request.deviceDocumentId) {
			this._errorsBag.add("deviceDocumentId is required.");
		}
	}
}
