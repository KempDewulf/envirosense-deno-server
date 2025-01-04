import { RouterContext } from "@oak/oak";
import { Endpoint, UpdateDeviceBrightnessController, UpdateDeviceBrightnessPresentedData, UpdateDeviceBrightnessPresenter } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { UpdateDeviceBrightness } from "EnviroSense/Application/mod.ts";
import { MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { UpdateDeviceBrightnessInput } from "EnviroSense/Application/Contracts/mod.ts";

export class UpdateDeviceBrightnessEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const request = await this.buildRequest(context);
        this.validateRequest(request);

        if (this._errorsBag.hasErrors) {
            context.response.status = 400;
            context.response.body = { errors: this._errorsBag.errors };
            return;
        }

        const outputDevice = new RequestResponse<UpdateDeviceBrightnessPresentedData>();
        const presenter = new UpdateDeviceBrightnessPresenter(outputDevice);
        const repository = new DeviceStrapiRepository();
        const messaging = MessagingBuilder.getInstance();
        const useCase = new UpdateDeviceBrightness(presenter, repository, messaging);
		const controller = new UpdateDeviceBrightnessController(useCase);

        await controller.handle(request);

        context.response.status = 200;
        context.response.body = outputDevice.response;
    }

    private async buildRequest(context: RouterContext<string>): Promise<UpdateDeviceBrightnessInput> {
        const deviceDocumentId = context.params.deviceDocumentId || "";
        const body = await context.request.body.json();

        return {
            deviceDocumentId,
            value: body.value,
        };
    }

    private validateRequest(request: UpdateDeviceBrightnessInput): void {
        this._errorsBag.clear();

        if (!request.deviceDocumentId) {
            this._errorsBag.add("deviceDocumentId is required");
        }

        if (!request.value === undefined) {
            this._errorsBag.add("value is required");
        }

        if (typeof request.value !== "number") {
			this._errorsBag.add("value must be a number");
		}

        if (request.value < 20 || request.value > 100) {
            this._errorsBag.add("value must be between 0 and 100");
        }
    }
}
