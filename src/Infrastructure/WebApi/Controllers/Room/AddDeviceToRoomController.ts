import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { AddDeviceToRoomInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';

export interface AddDeviceToRoomRequest {
    roomDocumentId: string;
    devices: string[];
}

export class AddDeviceToRoomController implements Controller<AddDeviceToRoomRequest> {
    private readonly _useCase: UseCase<AddDeviceToRoomInput>;

    constructor(useCase: UseCase<AddDeviceToRoomInput>) {
        this._useCase = useCase;
    }

    handle(request: AddDeviceToRoomRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        return this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: AddDeviceToRoomRequest,
    ): AddDeviceToRoomInput {
        return {
            roomDocumentId: request.roomDocumentId,
            devices: request.devices,
        };
    }
}
