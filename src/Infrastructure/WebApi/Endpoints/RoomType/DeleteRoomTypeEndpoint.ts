import { RouterContext } from "@oak/oak";
import {
	DeleteRoomTypeController,
	DeleteRoomTypeRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag } from "EnviroSense/Infrastructure/Shared/mod.ts";

import { RoomTypeStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";

import { DeleteRoomType } from "EnviroSense/Application/mod.ts";
import { RoomTypeRepository } from "EnviroSense/Application/Contracts/mod.ts";

export class DeleteRoomTypeEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const repository: RoomTypeRepository = new RoomTypeStrapiRepository();

		const useCase = new DeleteRoomType(repository);

		const controller = new DeleteRoomTypeController(useCase);

		await controller.handle(request);

		context.response.status = 204;
	}

	private buildRequest(
		context: RouterContext<string>,
	): DeleteRoomTypeRequest {
		const roomTypeDocumentId = context.params.roomTypeDocumentId || "";
		return { roomTypeDocumentId } as DeleteRoomTypeRequest;
	}

	private validateRequest(request: DeleteRoomTypeRequest): void {
		this._errorsBag.clear();

		if (!request.roomTypeDocumentId) {
			this._errorsBag.add("roomTypeDocumentId is required");
		}
	}
}
