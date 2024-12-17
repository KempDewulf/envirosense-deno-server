import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { ShowBuildingByDocumentIdInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';

export interface ShowBuildingByDocumentIdRequest {
    buildingDocumentId: string;
}

export class ShowBuildingByDocumentIdController
    implements Controller<ShowBuildingByDocumentIdRequest> {
    private readonly _useCase: UseCase<ShowBuildingByDocumentIdInput>;

    constructor(useCase: UseCase<ShowBuildingByDocumentIdInput>) {
        this._useCase = useCase;
    }

    public async handle(
        request: ShowBuildingByDocumentIdRequest,
    ): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: ShowBuildingByDocumentIdRequest,
    ): ShowBuildingByDocumentIdInput {
        return { buildingDocumentId: request.buildingDocumentId };
    }
}
