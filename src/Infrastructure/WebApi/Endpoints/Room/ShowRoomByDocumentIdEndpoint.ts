import { RouterContext } from '@oak/oak';
import {
    Endpoint,
    ShowRoomByDocumentIdController,
    ShowRoomByDocumentIdPresentedData,
    ShowRoomByDocumentIdPresenter,
    ShowRoomByDocumentIdRequest,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RequestResponse } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { RoomStrapiQueryRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { ShowRoomByDocumentId } from 'EnviroSense/Application/mod.ts';

export class ShowRoomByDocumentIdEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<ShowRoomByDocumentIdPresentedData>();
        const presenter = new ShowRoomByDocumentIdPresenter(outputDevice);

        const repository = new RoomStrapiQueryRepository();

        const useCase = new ShowRoomByDocumentId(presenter, repository);

        const controller = new ShowRoomByDocumentIdController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set('Content-Type', 'application/json');
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowRoomByDocumentIdEndpoint();
    }

    private buildRequest(
        context: RouterContext<string>,
    ): ShowRoomByDocumentIdRequest {
        const roomDocumentId = context.params.roomDocumentId || '';

        return { roomDocumentId } as ShowRoomByDocumentIdRequest;
    }
}
