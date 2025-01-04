import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";
import { UpdateDeviceUiModeInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";

export interface UpdateDeviceUiModeRequest {
	deviceDocumentId: string;
	mode: string;
}

export class UpdateDeviceUiModeController implements Controller<UpdateDeviceUiModeRequest> {
	private readonly _useCase: UseCase<UpdateDeviceUiModeInput>;

	constructor(useCase: UseCase<UpdateDeviceUiModeInput>) {
		this._useCase = useCase;
	}

	public async handle(request: UpdateDeviceUiModeRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: UpdateDeviceUiModeRequest,
	): UpdateDeviceUiModeInput {
		return {
			deviceDocumentId: request.deviceDocumentId,
			mode: request.mode,
		};
	}
}
