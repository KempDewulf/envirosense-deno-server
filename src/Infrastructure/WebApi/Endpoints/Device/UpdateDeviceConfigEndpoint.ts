import { RouterContext } from "@oak/oak";
import {
	Endpoint,
	UpdateDeviceConfigController,
	UpdateDeviceConfigPresentedData,
	UpdateDeviceConfigPresenter,
	UpdateDeviceConfigRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { UpdateDeviceConfig } from "EnviroSense/Application/mod.ts";
import { MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { DeviceConfigType } from "EnviroSense/Domain/mod.ts";

export class UpdateDeviceConfigEndpoint implements Endpoint {
	private readonly _errorsBag = new ErrorsBag();

	async handle(context: RouterContext<string>): Promise<void> {
		const request = await this.buildRequest(context);

		this.validateRequest(request);

		if (this._errorsBag.hasErrors) {
			context.response.status = 400;
			context.response.body = { errors: this._errorsBag.errors };
			return;
		}

		const outputDevice = new RequestResponse<UpdateDeviceConfigPresentedData>();
		const presenter = new UpdateDeviceConfigPresenter(outputDevice);
		const repository = new DeviceStrapiRepository();
		const messaging = MessagingBuilder.getInstance();
		const useCase = new UpdateDeviceConfig(presenter, repository, messaging);
		const controller = new UpdateDeviceConfigController(useCase);

		await controller.handle(request);

		context.response.status = 200;
		context.response.body = outputDevice.response;
	}

	private async buildRequest(context: RouterContext<string>): Promise<UpdateDeviceConfigRequest> {
		const deviceDocumentId = context.params.deviceDocumentId || "";
		const configType = context.params.configType || "";
		const body = await context.request.body.json();

		const value = configType === DeviceConfigType.BRIGHTNESS ? Number(body.value) : body.value;

		return {
			deviceDocumentId,
			configType,
			value: value,
		};
	}

	private validateRequest(request: UpdateDeviceConfigRequest): void {
		this._errorsBag.clear();

		if (!request.deviceDocumentId) {
			this._errorsBag.add("deviceDocumentId is required");
		}

		if (!request.configType) {
			this._errorsBag.add("configType is required");
		}

		if (request.configType === DeviceConfigType.BRIGHTNESS) {
			if (typeof request.value !== "number") {
				this._errorsBag.add("value must be a number");
			}
		} else if (request.configType === DeviceConfigType.UI_MODE) {
			if (typeof request.value !== "string") {
				this._errorsBag.add("value must be a string");
			}
		}

		if (request.value === undefined || Number.isNaN(request.value)) {
			this._errorsBag.add("value is required");
		}

		if (!Object.values(DeviceConfigType).includes(request.configType as DeviceConfigType)) {
			this._errorsBag.add(`Unsupported config type: ${request.configType}`);
		}
	}
}
