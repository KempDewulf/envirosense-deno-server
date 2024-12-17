import { RouterContext } from "@oak/oak";
import {
	AddDeviceToRoomController,
	AddDeviceToRoomRequest,
	Endpoint,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
	DeviceStrapiRepository,
	RoomStrapiRepository,
} from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { AddDeviceToRoom } from "EnviroSense/Application/mod.ts";

export class AddDeviceToRoomEndpoint implements Endpoint {
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
		const useCase = new AddDeviceToRoom(roomRepository, deviceRepository);

		const controller = new AddDeviceToRoomController(useCase);
		await controller.handle(request);

		context.response.status = 201;
	}

	private async buildRequest(
		context: RouterContext<string>,
	): Promise<AddDeviceToRoomRequest> {
		const { devices } = await context.request.body.json();
		const roomDocumentId = context.params.roomDocumentId;

		return {
			roomDocumentId: roomDocumentId,
			devices: devices,
		} as AddDeviceToRoomRequest;
	}

	private validateRequest(request: AddDeviceToRoomRequest): void {
		this._errors.clear();

		if (!request.roomDocumentId) {
			this._errors.add("roomDocumentId is required");
		}

		if (!request.devices || request.devices.length === 0) {
			this._errors.add(
				"devices is required. It must be an array of strings (the documentIds of the devices)",
			);
		}
	}
}
