import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { ShowDeviceConfigInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface ShowDeviceConfigRequest {
	deviceDocumentId: string;
}

export class ShowDeviceConfigController implements Controller<ShowDeviceConfigRequest> {
	private readonly _useCase: UseCase<ShowDeviceConfigInput>;

	constructor(useCase: UseCase<ShowDeviceConfigInput>) {
		this._useCase = useCase;
	}

	public async handle(request: ShowDeviceConfigRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(request: ShowDeviceConfigRequest): ShowDeviceConfigInput {
		return { deviceDocumentId: request.deviceDocumentId };
	}
}
