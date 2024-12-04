import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import {
    ShowDeviceDataInput,
    UseCase,
} from "EnviroSense/Application/Contracts/mod.ts";
import { Device } from "EnviroSense/Domain/mod.ts";

export interface ShowDeviceDataRequest {
    //check if this really works like this since we need to filter on device its identifier probably - now we juts use device
    device: Device;
}

export class ShowDeviceDataController
    implements Controller<ShowDeviceDataRequest>
{
    private readonly _useCase: UseCase<ShowDeviceDataInput>;

    constructor(useCase: UseCase<ShowDeviceDataInput>) {
        this._useCase = useCase;
    }

    public async handle(request: ShowDeviceDataRequest): Promise<void> {
        const useCaseInput = this.mapToUseCaseInput(request);
        await this._useCase.execute(useCaseInput);
    }

    protected mapToUseCaseInput(
        request: ShowDeviceDataRequest
    ): ShowDeviceDataInput {
        //check if this really works like this since we need to filter on device its identifier probably - now we juts use device
        return { device: request.device };
    }
}
