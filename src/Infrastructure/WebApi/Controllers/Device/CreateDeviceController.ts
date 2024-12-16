import { CreateDeviceInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { DeviceData, Room } from 'EnviroSense/Domain/mod.ts';

export interface CreateDeviceRequest {
    identifier: string;
    room: Room;
    device_data: DeviceData[];
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
            room: request.room,
            device_data: request.device_data,
        };
    }
}
