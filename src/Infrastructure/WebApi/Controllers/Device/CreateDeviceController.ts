import { CreateDeviceInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';

export interface CreateDeviceRequest {
    identifier: string;
    roomDocumentId: string;
}

export class CreateDeviceController implements Controller<CreateDeviceRequest> {
    private readonly _useCase: UseCase<CreateDeviceInput>;

    constructor(useCase: UseCase<CreateDeviceInput>) {
        this._useCase = useCase;
    }

    public async handle(request: CreateDeviceRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: CreateDeviceRequest): CreateDeviceInput {
        return {
            identifier: request.identifier,
            roomDocumentId: request.roomDocumentId
        };
    }
}
