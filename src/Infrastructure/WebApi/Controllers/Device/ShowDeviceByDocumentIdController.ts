import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
    ShowDeviceByDocumentIdInput,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowDeviceByDocumentIdRequest {
    deviceDocumentId: string;
}

export class ShowDeviceByDocumentIdController
    implements Controller<ShowDeviceByDocumentIdRequest>
{
    private readonly _useCase: UseCase<ShowDeviceByDocumentIdInput>;

    constructor(useCase: UseCase<ShowDeviceByDocumentIdInput>) {
        this._useCase = useCase;
    }

    public async handle(
        request: ShowDeviceByDocumentIdRequest
    ): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(request: ShowDeviceByDocumentIdRequest): ShowDeviceByDocumentIdInput {
        return { deviceDocumentId: request.deviceDocumentId };
    }
}
