import { RouterContext } from "@oak/oak";
import {
    Endpoint,
    ShowDevicesController,
    ShowDevicesPresentedData,
    ShowDevicesPresenter,
    ShowDevicesRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowDevices } from "EnviroSense/Application/mod.ts";

export class ShowDevicesEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<ShowDevicesPresentedData[]>();
        const presenter = new ShowDevicesPresenter(outputDevice);

        const repository = new DeviceStrapiQueryRepository();

        const useCase = new ShowDevices(presenter, repository);

        const controller = new ShowDevicesController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set("Content-Type", "application/json");
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowDevicesEndpoint();
    }

    private buildRequest(context: RouterContext<string>): ShowDevicesRequest {
        const identifier = context.request.url.searchParams.get("identifier")
            ? context.request.url.searchParams.get("identifier")
            : "";

        return { identifier } as ShowDevicesRequest;
    }
}
