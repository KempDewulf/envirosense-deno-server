import { CreateRoomInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';

export interface CreateRoomRequest {
    name: string;
    buildingDocumentId: string;
    roomDocumentId: string;
}

export class CreateRoomController implements Controller<CreateRoomRequest> {
    private readonly _useCase: UseCase<CreateRoomInput>;

    constructor(useCase: UseCase<CreateRoomInput>) {
        this._useCase = useCase;
    }

    public async handle(request: CreateRoomRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: CreateRoomRequest): CreateRoomInput {
        return {
            name: request.name,
            buildingDocumentId: request.buildingDocumentId,
            roomDocumentId: request.roomDocumentId
        };
    }
}
