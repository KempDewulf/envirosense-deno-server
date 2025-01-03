import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { UpdateDeviceLimitInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface UpdateDeviceLimitRequest {
	deviceDocumentId: string;
	limitType: string;
	value: number;
}

export class UpdateDeviceLimitController implements Controller<UpdateDeviceLimitRequest> {
	private readonly _useCase: UseCase<UpdateDeviceLimitInput>;

	constructor(useCase: UseCase<UpdateDeviceLimitInput>) {
		this._useCase = useCase;
	}

	public async handle(request: UpdateDeviceLimitRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: UpdateDeviceLimitRequest,
	): UpdateDeviceLimitInput {
		return {
			deviceDocumentId: request.deviceDocumentId,
			limitType: request.limitType,
			value: request.value,
		};
	}
}
