import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { ShowRoomTypesInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';

export interface ShowRoomTypesRequest {
    name: string;
}

export class ShowRoomTypesController implements Controller<ShowRoomTypesRequest> {
    private readonly _useCase: UseCase<ShowRoomTypesInput>;

    constructor(useCase: UseCase<ShowRoomTypesInput>) {
        this._useCase = useCase;
    }

    public async handle(request: ShowRoomTypesRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: ShowRoomTypesRequest,
    ): ShowRoomTypesInput {
        return { name: request.name };
    }
}
