import {
	Endpoint,
	ShowRoomLimitsController,
	ShowRoomLimitsPresentedData,
	ShowRoomLimitsPresenter,
	ShowRoomLimitsRequest,
	UpdateDeviceLimitPresentedData,
	UpdateDeviceLimitPresenter,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RouterContext } from "@oak/oak";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowRoomLimits, UpdateDeviceLimit } from "EnviroSense/Application/mod.ts";
import { DeviceStrapiRepository, RoomStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class ShowRoomLimitsEndpoint implements Endpoint {
	async handle(context: RouterContext<string>): Promise<void> {
		const outputDevice = new RequestResponse<
			ShowRoomLimitsPresentedData
		>();
		const outputUpdateDeviceLimit = new RequestResponse<UpdateDeviceLimitPresentedData>();
		const presenter = new ShowRoomLimitsPresenter(outputDevice);

		const repository = new RoomStrapiQueryRepository();
		const messaging = MessagingBuilder.getInstance();

		const deviceRepository = new DeviceStrapiRepository();
		const updateDeviceLimitPresenter = new UpdateDeviceLimitPresenter(outputUpdateDeviceLimit);
		const updateDeviceLimitUseCase = new UpdateDeviceLimit(
			updateDeviceLimitPresenter,
			deviceRepository,
			messaging,
		);

		const useCase = new ShowRoomLimits(
			presenter,
			repository,
			messaging,
			updateDeviceLimitUseCase,
		);

		const controller = new ShowRoomLimitsController(useCase);
		const request = this.buildRequest(context);
		await controller.handle(request);

		context.response.headers.set("Content-Type", "application/json");
		context.response.body = outputDevice.response;

		return Promise.resolve();
	}

	static create(): Endpoint {
		return new ShowRoomLimitsEndpoint();
	}

	private buildRequest(
		context: RouterContext<string>,
	): ShowRoomLimitsRequest {
		const roomDocumentId = context.params.roomDocumentId || "";

		return { roomDocumentId } as ShowRoomLimitsRequest;
	}
}
