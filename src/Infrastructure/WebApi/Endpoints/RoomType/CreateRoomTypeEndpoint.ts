import { RouterContext } from "@oak/oak";
import {
	CreateRoomTypeController,
	CreateRoomTypePresentedData,
	CreateRoomTypePresenter,
	CreateRoomTypeRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";

import { RoomTypeStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { CreateRoomType } from "EnviroSense/Application/mod.ts";
import { RoomTypeRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class CreateRoomTypeEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<CreateRoomTypePresentedData>();
		const presenter = new CreateRoomTypePresenter(outputDevice);

		const repository: RoomTypeRepository = new RoomTypeStrapiRepository();

		const useCase = new CreateRoomType(
			presenter,
			repository,
		);

		const controller = new CreateRoomTypeController(useCase);

		await controller.handle(request);

		const response = outputDevice.response as CreateRoomTypePresentedData;

		context.response.headers.set("Location", response.url);
		context.response.status = 201;
	}

	private async buildRequest(
		context: RouterContext<string>,
	): Promise<CreateRoomTypeRequest> {
		return await context.request.body.json() as CreateRoomTypeRequest;
	}

	private validateRequest(request: CreateRoomTypeRequest): void {
		this._errorsBag.clear();

		if (!request.name) {
			this._errorsBag.add("name is required.");
		}

		if (!request.icon) {
			this._errorsBag.add("icon is required.");
		}
	}
}
