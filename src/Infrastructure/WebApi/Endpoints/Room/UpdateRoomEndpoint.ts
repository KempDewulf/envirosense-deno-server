import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	UpdateRoomController,
	UpdateRoomPresentedData,
	UpdateRoomPresenter,
	UpdateRoomRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";

import { RoomStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { UpdateRoom } from "EnviroSense/Application/mod.ts";
import { RoomRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class UpdateRoomEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<UpdateRoomPresentedData>();
		const presenter = new UpdateRoomPresenter(outputDevice);

		const repository: RoomRepository = new RoomStrapiRepository();

		const useCase = new UpdateRoom(
			presenter,
			repository,
		);

		const controller = new UpdateRoomController(useCase);

		await controller.handle(request);

		const response = outputDevice.response as UpdateRoomPresentedData;

		context.response.status = 200;
		context.response.body = response;
	}

	private async buildRequest(context: RouterContext<string>): Promise<UpdateRoomRequest> {
		const roomDocumentId = context.params.roomDocumentId || "";
		const body = context.request.hasBody ? await context.request.body.json() : {};

		return {
			roomDocumentId,
			name: body.name,
		} as UpdateRoomRequest;
	}

	private validateRequest(request: UpdateRoomRequest): void {
		this._errorsBag.clear();

		if (!request.roomDocumentId) {
			this._errorsBag.add("roomDocumentId is required");
		}

		if (request.name === undefined) {
			this._errorsBag.add("name is required");
		}
	}
}
