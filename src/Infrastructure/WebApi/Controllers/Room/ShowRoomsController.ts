import { Controller } from 'EnviroSense/Infrastructure/Shared/mod.ts';
import { ShowRoomsInput, UseCase } from 'EnviroSense/Application/Contracts/mod.ts';

export interface ShowRoomsRequest {
    name: string;
}

export class ShowRoomsController implements Controller<ShowRoomsRequest> {
    private readonly _useCase: UseCase<ShowRoomsInput>;

    constructor(useCase: UseCase<ShowRoomsInput>) {
        this._useCase = useCase;
    }

    public async handle(request: ShowRoomsRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: ShowRoomsRequest): ShowRoomsInput {
        return { name: request.name };
    }
}
