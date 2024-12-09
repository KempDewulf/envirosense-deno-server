import { UpdateRoomTypeInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';
import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';

export interface UpdateRoomTypeRequest {
    roomTypeDocumentId: string;
    name?: string;
    icon?: string;
}

export class UpdateRoomTypeController implements Controller<UpdateRoomTypeRequest> {
    private readonly _useCase: UseCase<UpdateRoomTypeInput>;

    constructor(useCase: UseCase<UpdateRoomTypeInput>) {
        this._useCase = useCase;
    }

    public async handle(request: UpdateRoomTypeRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: UpdateRoomTypeRequest): UpdateRoomTypeInput {
        return {
            roomTypeDocumentId: request.roomTypeDocumentId,
            name: request.name,
            icon: request.icon,
        };
    }
}