import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { ShowRoomTypeByDocumentIdInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';

export interface ShowRoomTypeByDocumentIdRequest {
    roomTypeDocumentId: string;
}

export class ShowRoomTypeByDocumentIdController
    implements Controller<ShowRoomTypeByDocumentIdRequest> {
    private readonly _useCase: UseCase<ShowRoomTypeByDocumentIdInput>;

    constructor(useCase: UseCase<ShowRoomTypeByDocumentIdInput>) {
        this._useCase = useCase;
    }

    public async handle(
        request: ShowRoomTypeByDocumentIdRequest,
    ): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: ShowRoomTypeByDocumentIdRequest,
    ): ShowRoomTypeByDocumentIdInput {
        return { roomTypeDocumentId: request.roomTypeDocumentId };
    }
}
