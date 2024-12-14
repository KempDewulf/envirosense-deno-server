import { UpdateBuildingInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { Room } from 'EnviroSense/Domain/mod.ts';

export interface UpdateBuildingRequest {
    buildingDocumentId: string;
    name?: string;
    address?: string;
    rooms?: Room[];
}

export class UpdateBuildingController implements Controller<UpdateBuildingRequest> {
    private readonly _useCase: UseCase<UpdateBuildingInput>;

    constructor(useCase: UseCase<UpdateBuildingInput>) {
        this._useCase = useCase;
    }

    public async handle(request: UpdateBuildingRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: UpdateBuildingRequest): UpdateBuildingInput {
        return {
            buildingDocumentId: request.buildingDocumentId,
            name: request.name,
            address: request.address,
            rooms: request.rooms,
        };
    }
}
