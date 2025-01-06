import { RouterContext } from "@oak/oak";
import { DeleteRoomController, DeleteRoomRequest, Endpoint } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceDataStrapiRepository, RoomStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { DeleteRoom } from "EnviroSense/Application/mod.ts";

export class DeleteRoomEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const roomRepository = new RoomStrapiRepository();
		const deviceDataRepository = new DeviceDataStrapiRepository();


		const useCase = new DeleteRoom(roomRepository, deviceDataRepository);

		const controller = new DeleteRoomController(useCase);

		await controller.handle(request);

		context.response.status = 204;
	}

	private buildRequest(context: RouterContext<string>): DeleteRoomRequest {
		const roomDocumentId = context.params.roomDocumentId || "";
		return { roomDocumentId } as DeleteRoomRequest;
	}

	private validateRequest(request: DeleteRoomRequest): void {
		this._errorsBag.clear();

		if (!request.roomDocumentId) {
			this._errorsBag.add("roomDocumentId is required.");
		}
	}
}
