import { RouterContext } from "@oak/oak";
import {
    Endpoint,
    ShowRoomTypeByDocumentIdController,
    ShowRoomTypeByDocumentIdPresentedData,
    ShowRoomTypeByDocumentIdPresenter,
    ShowRoomTypeByDocumentIdRequest,
} from "EnviroSense/Infrastructure/WebApi/mod.ts";
import { RequestResponse } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { RoomTypeStrapiQueryRepository } from "EnviroSense/Infrastructure/Persistence/mod.ts";
import { ShowRoomTypeByDocumentId } from "EnviroSense/Application/mod.ts";

export class ShowRoomTypeByDocumentIdEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<ShowRoomTypeByDocumentIdPresentedData[]>();
        const presenter = new ShowRoomTypeByDocumentIdPresenter(outputDevice);

        const repository = new RoomTypeStrapiQueryRepository();

        const useCase = new ShowRoomTypeByDocumentId(presenter, repository);

        const controller = new ShowRoomTypeByDocumentIdController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set("Content-Type", "application/json");
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowRoomTypeByDocumentIdEndpoint();
    }

    private buildRequest(
        context: RouterContext<string>
    ): ShowRoomTypeByDocumentIdRequest {
        const roomTypeDocumentId = context.request.url.searchParams.get("roomTypeDocumentId")
            ? context.request.url.searchParams.get("roomTypeDocumentId")
            : "";

        return { roomTypeDocumentId } as ShowRoomTypeByDocumentIdRequest;
    }
}
