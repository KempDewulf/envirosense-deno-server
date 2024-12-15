import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import {
    RemoveRoomFromBuildingInput,
    UseCase,
} from 'EnviroSense/Application/Contracts/mod.ts';

export interface RemoveRoomFromBuildingRequest {
    buildingDocumentId: string;
    roomDocumentId: string;
}

export class RemoveRoomFromBuildingController
    implements Controller<RemoveRoomFromBuildingRequest> {
    private readonly _useCase: UseCase<RemoveRoomFromBuildingInput>;

    constructor(useCase: UseCase<RemoveRoomFromBuildingInput>) {
        this._useCase = useCase;
    }

    handle(request: RemoveRoomFromBuildingRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        return this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: RemoveRoomFromBuildingRequest,
    ): RemoveRoomFromBuildingInput {
        return {
            buildingDocumentId: request.buildingDocumentId,
            roomDocumentId: request.roomDocumentId,
        };
    }
}
