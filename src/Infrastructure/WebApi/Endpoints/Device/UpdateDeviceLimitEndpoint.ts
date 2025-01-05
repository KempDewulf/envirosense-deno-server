import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	UpdateDeviceLimitController,
	UpdateDeviceLimitPresentedData,
	UpdateDeviceLimitPresenter,
	UpdateDeviceLimitRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { UpdateDeviceLimit } from "EnviroSense/Application/mod.ts";
import { MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { DeviceLimitType } from "EnviroSense/Domain/mod.ts";

export class UpdateDeviceLimitEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<UpdateDeviceLimitPresentedData>();
		const presenter = new UpdateDeviceLimitPresenter(outputDevice);
		const repository = new DeviceStrapiRepository();
		const messaging = MessagingBuilder.getInstance();
		const useCase = new UpdateDeviceLimit(presenter, repository, messaging);
		const controller = new UpdateDeviceLimitController(useCase);

		await controller.handle(request);

		context.response.status = 200;
		context.response.body = outputDevice.response;
	}

	private async buildRequest(context: RouterContext<string>): Promise<UpdateDeviceLimitRequest> {
		const deviceDocumentId = context.params.deviceDocumentId || "";
		const limitType = context.params.limitType || "";
		const body = await context.request.body.json();

		return {
			deviceDocumentId,
			limitType,
			value: body.value,
		};
	}

	private validateRequest(request: UpdateDeviceLimitRequest): void {
		this._errorsBag.clear();

		if (!request.deviceDocumentId) {
			this._errorsBag.add("deviceDocumentId is required");
		}

		if (!request.limitType) {
			this._errorsBag.add("limitType is required");
		}

		if (request.value === undefined) {
			this._errorsBag.add("value is required");
		}

		if (typeof request.value !== "number") {
			this._errorsBag.add("value must be a number");
		}

		if (!Object.values(DeviceLimitType).includes(request.limitType as DeviceLimitType)) {
            this._errorsBag.add(`Unsupported limit type: ${request.limitType}`);
        }
	}
}
