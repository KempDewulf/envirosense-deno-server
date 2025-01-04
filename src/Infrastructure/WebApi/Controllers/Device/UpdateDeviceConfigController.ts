import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { UpdateDeviceConfigInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface UpdateDeviceConfigRequest {
	deviceDocumentId: string;
	configType: string;
	value: string | number;
}

export class UpdateDeviceConfigController implements Controller<UpdateDeviceConfigRequest> {
	private readonly _useCase: UseCase<UpdateDeviceConfigInput>;

	constructor(useCase: UseCase<UpdateDeviceConfigInput>) {
		this._useCase = useCase;
	}

	public async handle(request: UpdateDeviceConfigRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: UpdateDeviceConfigRequest,
	): UpdateDeviceConfigInput {
		return {
			deviceDocumentId: request.deviceDocumentId,
			configType: request.configType,
			value: request.value,
		};
	}
}
