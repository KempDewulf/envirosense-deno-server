import { RouterContext } from "@oak/oak";
import {
	CreateDeviceController,
	CreateDevicePresentedData,
	CreateDevicePresenter,
	CreateDeviceRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import {
	ErrorsBag,
	RequestResponse,
} from "EnviroSense/Infrastructure/Shared/mod.ts";

import {
	DeviceStrapiRepository,
	RoomStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { CreateDevice } from "EnviroSense/Application/mod.ts";
import {
	DeviceRepository,
	RoomRepository,
} from "EnviroSense/Application/Contracts/mod.ts";

export class CreateDeviceEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<CreateDevicePresentedData>();
		const presenter = new CreateDevicePresenter(outputDevice);

		const deviceRepository: DeviceRepository = new DeviceStrapiRepository();
		const roomRepository: RoomRepository = new RoomStrapiRepository();

		const useCase = new CreateDevice(
			presenter,
			deviceRepository,
			roomRepository,
		);

		const controller = new CreateDeviceController(useCase);

		await controller.handle(request);

		const response = outputDevice.response as CreateDevicePresentedData;

		context.response.headers.set("Location", response.url);
		context.response.status = 201;
	}

	private async buildRequest(
		context: RouterContext<string>,
	): Promise<CreateDeviceRequest> {
		return await context.request.body.json() as CreateDeviceRequest;
	}

	private validateRequest(request: CreateDeviceRequest): void {
		this._errorsBag.clear();

		if (!request.identifier) {
			this._errorsBag.add("identifier is required.");
		}

		if (!request.roomDocumentId) {
			this._errorsBag.add("roomDocumentId is required.");
		}
	}
}
