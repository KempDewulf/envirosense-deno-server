import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	UpdateDeviceController,
	UpdateDevicePresentedData,
	UpdateDevicePresenter,
	UpdateDeviceRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";

import { DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { UpdateDevice } from "EnviroSense/Application/mod.ts";
import { DeviceRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class UpdateDeviceEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<UpdateDevicePresentedData>();
		const presenter = new UpdateDevicePresenter(outputDevice);

		const repository: DeviceRepository = new DeviceStrapiRepository();

		const useCase = new UpdateDevice(presenter, repository);

		const controller = new UpdateDeviceController(useCase);

		await controller.handle(request);

		const response = outputDevice.response as UpdateDevicePresentedData;

		context.response.status = 200;
		context.response.body = response;
	}

	private async buildRequest(
		context: RouterContext<string>,
	): Promise<UpdateDeviceRequest> {
		const deviceDocumentId = context.params.deviceDocumentId || "";
		const body = context.request.hasBody ? await context.request.body.json() : {};

		return {
			deviceDocumentId,
			identifier: body.identifier,
		} as UpdateDeviceRequest;
	}

	private validateRequest(request: UpdateDeviceRequest): void {
		this._errorsBag.clear();

		if (!request.deviceDocumentId) {
			this._errorsBag.add("deviceDocumentId is required");
		}

		if (request.identifier === undefined) {
			this._errorsBag.add(
				"identifier is required. It must be a string.",
			);
		}
	}
}
