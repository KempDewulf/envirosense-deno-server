import { DeleteAllDeviceDataFromDeviceInput, UseCase } from "EnviroSense/Application/Contracts/mod.ts";
import { Controller } from "EnviroSense/Infrastructure/Shared/mod.ts";

export interface DeleteAllDeviceDataFromDeviceRequest {
	deviceDocumentId: string;
}

export class DeleteAllDeviceDataFromDeviceController implements Controller<DeleteAllDeviceDataFromDeviceRequest> {
	private readonly _useCase: UseCase<DeleteAllDeviceDataFromDeviceInput>;

	constructor(useCase: UseCase<DeleteAllDeviceDataFromDeviceInput>) {
		this._useCase = useCase;
	}

	public async handle(request: DeleteAllDeviceDataFromDeviceRequest): Promise<void> {
		const useCaseInput = this.mapToUseCaseInput(request);
		await this._useCase.execute(useCaseInput);
	}

	protected mapToUseCaseInput(
		request: DeleteAllDeviceDataFromDeviceRequest,
	): DeleteAllDeviceDataFromDeviceInput {
		return {
			deviceDocumentId: request.deviceDocumentId,
		};
	}
}
