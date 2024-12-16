import { CreateBuildingInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { Room } from 'EnviroSense/Domain/mod.ts';

export interface CreateBuildingRequest {
    name: string;
    address: string;
    rooms: Room[];
}

export class CreateBuildingController implements Controller<CreateBuildingRequest> {
    private readonly _useCase: UseCase<CreateBuildingInput>;

    constructor(useCase: UseCase<CreateBuildingInput>) {
        this._useCase = useCase;
    }

    public async handle(request: CreateBuildingRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: CreateBuildingRequest): CreateBuildingInput {
        return {
            name: request.name,
            address: request.address,
            rooms: request.rooms,
        };
    }
}
