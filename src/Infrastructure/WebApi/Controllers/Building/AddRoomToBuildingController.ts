import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import {
    AddRoomToBuildingInput,
    UseCase,
} from 'EnviroSense/Application/Contracts/mod.ts';

export interface AddRoomToBuildingRequest {
    buildingDocumentId: string;
    rooms: string[];
}

export class AddRoomToBuildingController
    implements Controller<AddRoomToBuildingRequest> {
    private readonly _useCase: UseCase<AddRoomToBuildingInput>;

    constructor(useCase: UseCase<AddRoomToBuildingInput>) {
        this._useCase = useCase;
    }

    handle(request: AddRoomToBuildingRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        return this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: AddRoomToBuildingRequest,
    ): AddRoomToBuildingInput {
        return {
            buildingDocumentId: request.buildingDocumentId,
            rooms: request.rooms
        };
    }
}
