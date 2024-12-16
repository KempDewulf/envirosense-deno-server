import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import {
    AddDeviceDataToDeviceInput,
    UseCase,
} from 'EnviroSense/Application/Contracts/mod.ts';

export interface AddDeviceDataToDeviceRequest {
    deviceDocumentId: string;
    device_data: string[];
}

export class AddDeviceDataToDeviceController
    implements Controller<AddDeviceDataToDeviceRequest> {
    private readonly _useCase: UseCase<AddDeviceDataToDeviceInput>;

    constructor(useCase: UseCase<AddDeviceDataToDeviceInput>) {
        this._useCase = useCase;
    }

    handle(request: AddDeviceDataToDeviceRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        return this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: AddDeviceDataToDeviceRequest,
    ): AddDeviceDataToDeviceInput {
        return {
            deviceDocumentId: request.deviceDocumentId,
            device_data: request.device_data
        };
    }
}
