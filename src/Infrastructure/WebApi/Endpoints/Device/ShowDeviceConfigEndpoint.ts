import {
	Endpoint,
	ShowDeviceConfigController,
	ShowDeviceConfigPresentedData,
	ShowDeviceConfigPresenter,
	ShowDeviceConfigRequest,
	UpdateDeviceLimitPresentedData,
	UpdateDeviceLimitPresenter,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RouterContext } from "@oak/oak";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowDeviceConfig, UpdateDeviceLimit } from "EnviroSense/Application/mod.ts";
import { DeviceStrapiRepository, DeviceStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";

export class ShowDeviceConfigEndpoint implements Endpoint {
	async handle(context: RouterContext<string>): Promise<void> {
		const outputDevice = new RequestResponse<
			ShowDeviceConfigPresentedData
		>();
		const outputUpdateDeviceLimit = new RequestResponse<UpdateDeviceLimitPresentedData>();
		const presenter = new ShowDeviceConfigPresenter(outputDevice);

		const repository = new DeviceStrapiQueryRepository();
		const messaging = MessagingBuilder.getInstance();

		const deviceRepository = new DeviceStrapiRepository();
		const updateDeviceLimitPresenter = new UpdateDeviceLimitPresenter(outputUpdateDeviceLimit);
		const updateDeviceLimitUseCase = new UpdateDeviceLimit(
			updateDeviceLimitPresenter,
			deviceRepository,
			messaging,
		);

		const useCase = new ShowDeviceConfig(
			presenter,
			repository,
			messaging,
			updateDeviceLimitUseCase,
		);

		const controller = new ShowDeviceConfigController(useCase);
		const request = this.buildRequest(context);
		await controller.handle(request);

		context.response.headers.set("Content-Type", "application/json");
		context.response.body = outputDevice.response;

		return Promise.resolve();
	}

	static create(): Endpoint {
		return new ShowDeviceConfigEndpoint();
	}

	private buildRequest(
		context: RouterContext<string>,
	): ShowDeviceConfigRequest {
		const deviceDocumentId = context.params.deviceDocumentId || "";

		return { deviceDocumentId } as ShowDeviceConfigRequest;
	}
}
