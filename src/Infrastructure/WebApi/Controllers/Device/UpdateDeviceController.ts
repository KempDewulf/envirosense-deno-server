import { UpdateDeviceInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';

export interface UpdateDeviceRequest {
    deviceDocumentId: string;
    identifier: string;
}

export class UpdateDeviceController implements Controller<UpdateDeviceRequest> {
    private readonly _useCase: UseCase<UpdateDeviceInput>;

    constructor(useCase: UseCase<UpdateDeviceInput>) {
        this._useCase = useCase;
    }

    public async handle(request: UpdateDeviceRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: UpdateDeviceRequest,
    ): UpdateDeviceInput {
        return {
            deviceDocumentId: request.deviceDocumentId,
            identifier: request.identifier,
        };
    }
}
