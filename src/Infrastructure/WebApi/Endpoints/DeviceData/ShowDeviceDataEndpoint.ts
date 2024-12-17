import { RouterContext } from '@oak/oak';
import {
    Endpoint,
    ShowDeviceDataController,
    ShowDeviceDataPresentedData,
    ShowDeviceDataPresenter,
    ShowDeviceDataRequest,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { RequestResponse } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { DeviceDataStrapiQueryRepository } from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { ShowDeviceData } from 'EnviroSense/Application/mod.ts';

export class ShowDeviceDataEndpoint implements Endpoint {
    async handle(context: RouterContext<string>): Promise<void> {
        const outputDevice = new RequestResponse<
            ShowDeviceDataPresentedData[]
        >();
        const presenter = new ShowDeviceDataPresenter(outputDevice);

        const repository = new DeviceDataStrapiQueryRepository();

        const useCase = new ShowDeviceData(presenter, repository);

        const controller = new ShowDeviceDataController(useCase);
        const request = this.buildRequest(context);
        await controller.handle(request);

        context.response.headers.set('Content-Type', 'application/json');
        context.response.body = outputDevice.response;

        return Promise.resolve();
    }

    static create(): Endpoint {
        return new ShowDeviceDataEndpoint();
    }

    private buildRequest(
        context: RouterContext<string>,
    ): ShowDeviceDataRequest {
        const identifier = context.request.url.searchParams.get('identifier')
            ? context.request.url.searchParams.get('identifier')
            : '';

        return { identifier } as ShowDeviceDataRequest;
    }
}
