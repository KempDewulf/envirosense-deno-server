import { RouterContext } from "@oak/oak";
import {
    Endpoint,
    ShowDeviceDataByDocumentIdController,
    ShowDeviceDataByDocumentIdPresentedData,
    ShowDeviceDataByDocumentIdPresenter,
    ShowDeviceDataByDocumentIdRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { DeviceDataStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowDeviceDataByDocumentId } from "EnviroSense/Application/mod.ts";

export class ShowDeviceDataByDocumentIdEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDeviceData = new RequestResponse<ShowDeviceDataByDocumentIdPresentedData>();
        const presenter = new ShowDeviceDataByDocumentIdPresenter(outputDeviceData);

        const repository = new DeviceDataStrapiQueryRepository();

        const useCase = new ShowDeviceDataByDocumentId(presenter, repository);

        const controller = new ShowDeviceDataByDocumentIdController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set("Content-Type", "application/json");
        context.response.body = outputDeviceData.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowDeviceDataByDocumentIdEndpoint();
    }

    private buildRequest(
        context: RouterContext<string>
    ): ShowDeviceDataByDocumentIdRequest {
        const deviceDataDocumentId = context.params.deviceDataDocumentId || "";

        return { deviceDataDocumentId } as ShowDeviceDataByDocumentIdRequest;
    }
}
