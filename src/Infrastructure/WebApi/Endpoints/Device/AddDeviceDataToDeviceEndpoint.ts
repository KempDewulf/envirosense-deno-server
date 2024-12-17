import { RouterContext } from '@oak/oak';
import {
    AddDeviceDataToDeviceController,
    AddDeviceDataToDeviceRequest,
    Endpoint,
} from 'EnviroSense/Infrastructure/WebApi/mod.ts';
import { ErrorsBag } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import {
    DeviceDataStrapiRepository,
    DeviceStrapiRepository,
} from 'EnviroSense/Infrastructure/Persistence/mod.ts';
import { AddDeviceDataToDevice } from 'EnviroSense/Application/mod.ts';

export class AddDeviceDataToDeviceEndpoint implements Endpoint {
    private readonly _errors = new ErrorsBag();

    async handle(context: RouterContext<string>): Promise<void> {
        const request = await this.buildRequest(context);

        this.validateRequest(request);

        if (this._errors.hasErrors) {
            context.response.status = 400;
            context.response.body = { errors: this._errors.errors };
            return;
        }

        const deviceDataRepository = new DeviceDataStrapiRepository();
        const deviceRepository = new DeviceStrapiRepository();
        const useCase = new AddDeviceDataToDevice(deviceRepository, deviceDataRepository);

        const controller = new AddDeviceDataToDeviceController(useCase);
        await controller.handle(request);

        context.response.status = 201;
    }

    private async buildRequest(
        context: RouterContext<string>,
    ): Promise<AddDeviceDataToDeviceRequest> {
        const { device_data } = await context.request.body.json();
        const deviceDocumentId = context.params.deviceDocumentId;

        return {
            deviceDocumentId: deviceDocumentId,
            device_data: device_data,
        } as AddDeviceDataToDeviceRequest;
    }

    private validateRequest(request: AddDeviceDataToDeviceRequest): void {
        this._errors.clear();

        if (!request.deviceDocumentId) {
            this._errors.add('deviceDocumentId is required');
        }

        if (!request.device_data || request.device_data.length === 0) {
            this._errors.add(
                'device_data is required. It must be an array of strings (the documentIds of the device data)',
            );
        }
    }
}
