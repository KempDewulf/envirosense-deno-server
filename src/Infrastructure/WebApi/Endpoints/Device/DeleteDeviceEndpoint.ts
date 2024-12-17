import { RouterContext } from "@oak/oak";
import {
	DeleteDeviceController,
	DeleteDeviceRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag } from "EnviroSense/Infrastructure/Shared/mod.ts";

import { DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { DeleteDevice } from "EnviroSense/Application/mod.ts";
import { DeviceRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteDeviceEndpoint implements Endpoint {
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

		const useCase = new DeleteDevice(repository);

		const controller = new DeleteDeviceController(useCase);

		await controller.handle(request);

		context.response.status = 204;
	}

	private buildRequest(context: RouterContext<string>): DeleteDeviceRequest {
		const deviceDocumentId = context.params.deviceDocumentId || "";
		return { deviceDocumentId } as DeleteDeviceRequest;
	}

	private validateRequest(request: DeleteDeviceRequest): void {
		this._errorsBag.clear();

		if (!request.deviceDocumentId) {
			this._errorsBag.add("deviceDocumentId is required");
		}
	}
}
