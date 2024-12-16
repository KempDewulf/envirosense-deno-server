import { UpdateRoomInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';

export interface UpdateRoomRequest {
    roomDocumentId: string;
    name: string;
}

export class UpdateRoomController implements Controller<UpdateRoomRequest> {
    private readonly _useCase: UseCase<UpdateRoomInput>;

    constructor(useCase: UseCase<UpdateRoomInput>) {
        this._useCase = useCase;
    }

    public async handle(request: UpdateRoomRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: UpdateRoomRequest): UpdateRoomInput {
        return {
            roomDocumentId: request.roomDocumentId,
            name: request.name,
        };
    }
}
