import { RouterContext } from '@oak/oak';
import {
    Endpoint,
    ShowDeviceByDocumentIdController,
    ShowDeviceByDocumentIdPresentedData,
    ShowDeviceByDocumentIdPresenter,
    ShowDeviceByDocumentIdRequest,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RequestResponse } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { DeviceStrapiQueryRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { ShowDeviceByDocumentId } from 'EnviroSense/Application/mod.ts';

export class ShowDeviceByDocumentIdEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<ShowDeviceByDocumentIdPresentedData>();
        const presenter = new ShowDeviceByDocumentIdPresenter(outputDevice);

        const repository = new DeviceStrapiQueryRepository();

        const useCase = new ShowDeviceByDocumentId(presenter, repository);

        const controller = new ShowDeviceByDocumentIdController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set('Content-Type', 'application/json');
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowDeviceByDocumentIdEndpoint();
    }

    private buildRequest(
        context: RouterContext<string>,
    ): ShowDeviceByDocumentIdRequest {
        const deviceDocumentId = context.params.deviceDocumentId || '';

        return { deviceDocumentId } as ShowDeviceByDocumentIdRequest;
    }
}
