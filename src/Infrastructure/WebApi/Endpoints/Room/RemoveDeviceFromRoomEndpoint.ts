import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	RemoveDeviceFromRoomController,
	RemoveDeviceFromRoomRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	DeviceStrapiRepository,
	RoomStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { RemoveDeviceFromRoom } from "EnviroSense/Application/mod.ts";

export class RemoveDeviceFromRoomEndpoint implements Endpoint {
	private readonly _errors = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errors.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errors.errors };
			return;
		}

		const roomRepository = new RoomStrapiRepository();
		const deviceRepository = new DeviceStrapiRepository();
		const useCase = new RemoveDeviceFromRoom(
			roomRepository,
			deviceRepository,
		);

		const controller = new RemoveDeviceFromRoomController(useCase);
		await controller.handle(request);

		context.response.status = 201;
	}

	private buildRequest(
		context: RouterContext<string>,
	): Promise<RemoveDeviceFromRoomRequest> {
		const roomDocumentId = context.params.roomDocumentId;
		const deviceDocumentId = context.params.deviceDocumentId;

		return {
			roomDocumentId: roomDocumentId,
			deviceDocumentId: deviceDocumentId,
		} as RemoveDeviceFromRoomRequest;
	}

	private validateRequest(request: RemoveDeviceFromRoomRequest): void {
		this._errors.clear();

		if (!request.roomDocumentId) {
			this._errors.add("roomDocumentId is required.");
		}

		if (!request.deviceDocumentId) {
			this._errors.add("deviceDocumentId is required.");
		}
	}
}
