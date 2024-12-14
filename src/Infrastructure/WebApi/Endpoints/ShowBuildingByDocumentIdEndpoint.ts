import { RouterContext } from "@oak/oak";
import {
    Endpoint,
    ShowBuildingByDocumentIdController,
    ShowBuildingByDocumentIdPresentedData,
    ShowBuildingByDocumentIdPresenter,
    ShowBuildingByDocumentIdRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { BuildingStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowBuildingByDocumentId } from "EnviroSense/Application/mod.ts";

export class ShowBuildingByDocumentIdEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<ShowBuildingByDocumentIdPresentedData>();
        const presenter = new ShowBuildingByDocumentIdPresenter(outputDevice);

        const repository = new BuildingStrapiQueryRepository();

        const useCase = new ShowBuildingByDocumentId(presenter, repository);

        const controller = new ShowBuildingByDocumentIdController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set("Content-Type", "application/json");
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowBuildingByDocumentIdEndpoint();
    }

    private buildRequest(
        context: RouterContext<string>
    ): ShowBuildingByDocumentIdRequest {
        const buildingDocumentId = context.params.buildingDocumentId || "";

        return { buildingDocumentId } as ShowBuildingByDocumentIdRequest;
    }
}
