import { DeleteDeviceInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface DeleteDeviceRequest {
	deviceDocumentId: string;
}

export class DeleteDeviceController implements Controller<DeleteDeviceRequest> {
	private readonly _useCase: UseCase<DeleteDeviceInput>;

	constructor(useCase: UseCase<DeleteDeviceInput>) {
		this._useCase = useCase;
	}

	public async handle(request: DeleteDeviceRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(request: DeleteDeviceRequest): DeleteDeviceInput {
		return {
			deviceDocumentId: request.deviceDocumentId,
		};
	}
}
