import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { ShowRoomByDocumentIdInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';

export interface ShowRoomByDocumentIdRequest {
    roomDocumentId: string;
}

export class ShowRoomByDocumentIdController implements Controller<ShowRoomByDocumentIdRequest> {
    private readonly _useCase: UseCase<ShowRoomByDocumentIdInput>;

    constructor(useCase: UseCase<ShowRoomByDocumentIdInput>) {
        this._useCase = useCase;
    }

    public async handle(request: ShowRoomByDocumentIdRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: ShowRoomByDocumentIdRequest,
    ): ShowRoomByDocumentIdInput {
        return { roomDocumentId: request.roomDocumentId };
    }
}
