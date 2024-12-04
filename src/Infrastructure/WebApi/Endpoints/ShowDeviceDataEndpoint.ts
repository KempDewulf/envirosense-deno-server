import { RouterContext } from "@oak/oak";
import {
    Endpoint,
    ShowDeviceDataController,
    ShowDeviceDataPresentedData,
    ShowDeviceDataPresenter,
    ShowDeviceDataRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { BuildingStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowDeviceData } from "EnviroSense/Application/mod.ts";

export class ShowDeviceDataEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<
            ShowDeviceDataPresentedData[]
        >();
        const presenter = new ShowDeviceDataPresenter(outputDevice);

        const repository = new BuildingStrapiQueryRepository();

        const useCase = new ShowDeviceData(presenter, repository);

        const controller = new ShowDeviceDataController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set("Content-Type", "application/json");
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowDeviceDataEndpoint();
    }

     //check if this really works like this since we need to filter on device its identifier probably - now we juts use device
    private buildRequest(
        context: RouterContext<string>
    ): ShowDeviceDataRequest {
        const device = context.request.url.searchParams.get("device")
            ? context.request.url.searchParams.get("device")
            : "";

        return { device } as ShowDeviceDataRequest;
    }
}
