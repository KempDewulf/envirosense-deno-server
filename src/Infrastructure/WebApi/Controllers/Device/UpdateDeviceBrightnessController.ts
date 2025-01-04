import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { UpdateDeviceBrightnessInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface UpdateDeviceBrightnessRequest {
	deviceDocumentId: string;
	value: number;
}

export class UpdateDeviceBrightnessController implements Controller<UpdateDeviceBrightnessRequest> {
	private readonly _useCase: UseCase<UpdateDeviceBrightnessInput>;

	constructor(useCase: UseCase<UpdateDeviceBrightnessInput>) {
		this._useCase = useCase;
	}

	public async handle(request: UpdateDeviceBrightnessRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: UpdateDeviceBrightnessRequest,
	): UpdateDeviceBrightnessInput {
		return {
			deviceDocumentId: request.deviceDocumentId,
			value: request.value,
		};
	}
}
