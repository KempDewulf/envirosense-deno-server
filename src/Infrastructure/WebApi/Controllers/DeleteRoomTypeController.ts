import { DeleteRoomTypeInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';

export interface DeleteRoomTypeRequest {
    roomTypeDocumentId: string;
}

export class DeleteRoomTypeController implements Controller<DeleteRoomTypeRequest> {
    private readonly _useCase: UseCase<DeleteRoomTypeInput>;

    constructor(useCase: UseCase<DeleteRoomTypeInput>) {
        this._useCase = useCase;
    }

    public async handle(request: DeleteRoomTypeRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: DeleteRoomTypeRequest): DeleteRoomTypeInput {
        return {
            roomTypeDocumentId: request.roomTypeDocumentId,
        };
    }
}
