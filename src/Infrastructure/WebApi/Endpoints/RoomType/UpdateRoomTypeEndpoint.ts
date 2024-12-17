import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	UpdateRoomTypeController,
	UpdateRoomTypePresentedData,
	UpdateRoomTypePresenter,
	UpdateRoomTypeRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";

import { RoomTypeStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { UpdateRoomType } from "EnviroSense/Application/mod.ts";
import { RoomTypeRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class UpdateRoomTypeEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<UpdateRoomTypePresentedData>();
		const presenter = new UpdateRoomTypePresenter(outputDevice);

		const repository: RoomTypeRepository = new RoomTypeStrapiRepository();

		const useCase = new UpdateRoomType(
			presenter,
			repository,
		);

		const controller = new UpdateRoomTypeController(useCase);

		await controller.handle(request);

		const response = outputDevice.response as UpdateRoomTypePresentedData;

		context.response.status = 200;
		context.response.body = response;
	}

	private async buildRequest(context: RouterContext<string>): Promise<UpdateRoomTypeRequest> {
		const roomTypeDocumentId = context.params.roomTypeDocumentId || "";
		const body = context.request.hasBody ? await context.request.body.json() : {};

		return {
			roomTypeDocumentId,
			name: body.name,
			icon: body.icon,
		} as UpdateRoomTypeRequest;
	}

	private validateRequest(request: UpdateRoomTypeRequest): void {
		this._errorsBag.clear();

		if (!request.roomTypeDocumentId) {
			this._errorsBag.add("roomTypeDocumentId is required");
		}

		if (request.name === undefined && request.icon === undefined) {
			this._errorsBag.add('At least one of "name" or "icon" must be provided');
		}
	}
}
