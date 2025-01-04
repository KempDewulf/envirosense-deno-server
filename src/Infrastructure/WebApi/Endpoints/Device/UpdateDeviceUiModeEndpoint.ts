import { RouterContext } from "@oak/oak";
import { Endpoint, UpdateDeviceUiModeController, UpdateDeviceUiModePresentedData, UpdateDeviceUiModePresenter } from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { ErrorsBag, RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceStrapiRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { UpdateDeviceUiMode } from "EnviroSense/Application/mod.ts";
import { MessagingBuilder } from "EnviroSense/Infrastructure/Messaging/mod.ts";
import { UpdateDeviceUiModeInput } from "EnviroSense/Application/Contracts/mod.ts";
import { DeviceUiModeType } from "EnviroSense/Domain/mod.ts";

export class UpdateDeviceUiModeEndpoint implements Endpoint {
    private readonly _errorsBag = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const request = await this.buildRequest(context);
        this.validateRequest(request);

        if (this._errorsBag.hasErrors) {
            context.response.status = 400;
            context.response.body = { errors: this._errorsBag.errors };
            return;
        }

        const outputDevice = new RequestResponse<UpdateDeviceUiModePresentedData>();
        const presenter = new UpdateDeviceUiModePresenter(outputDevice);
        const repository = new DeviceStrapiRepository();
        const messaging = MessagingBuilder.getInstance();
        const useCase = new UpdateDeviceUiMode(presenter, repository, messaging);
		const controller = new UpdateDeviceUiModeController(useCase);

        await controller.handle(request);

        context.response.status = 200;
        context.response.body = outputDevice.response;
    }

    private async buildRequest(context: RouterContext<string>): Promise<UpdateDeviceUiModeInput> {
        const deviceDocumentId = context.params.deviceDocumentId || "";
        const body = await context.request.body.json();

        return {
            deviceDocumentId,
            mode: body.mode,
        };
    }

    private validateRequest(request: UpdateDeviceUiModeInput): void {
        this._errorsBag.clear();

        if (!request.deviceDocumentId) {
            this._errorsBag.add("deviceDocumentId is required");
        }

        if (!request.mode) {
            this._errorsBag.add("mode is required");
        }

        if (!Object.values(DeviceUiModeType).includes(request.mode as DeviceUiModeType)) {
            this._errorsBag.add("Invalid UI mode");
        }
    }
}
